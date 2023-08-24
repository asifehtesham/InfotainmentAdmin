import { Component, OnInit, ViewChild, ElementRef, Input, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { SingleFileUploadComponent } from 'src/app/coreui/single-file-upload/single-file-upload.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Imenu } from 'src/app/models/Imenu';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { ImenuService } from 'src/app/services/imenu.service';
import { TemplatesService } from 'src/app/services/templates.service';
import { Templates } from 'src/app/models/Templates';
// import { CountryService } from 'src/app/services/country.service';



@Component({
  selector: 'app-imenu-detail',
  templateUrl: './imenu-detail.component.html',
  styleUrls: ['./imenu-detail.component.scss']
})
export class ImenuDetailComponent {

  templates: Templates[] = [];
  id: number;
  imenu: Imenu;
  imenuForm: FormGroup;

  url: string = '';
  done: any;
  isImenuSaved: boolean = true;
  
  countries: SelectModel[];


  @ViewChild('imagefile', { static: true }) imagefile: ElementRef;
  @ViewChild('imageControl', { static: false }) imageControl: SingleFileUploadComponent;

  editorConfig: any = EditorConfig;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private imenuService: ImenuService, 
    //private countryService: CountryService,
    private snakbar: MatSnackBar, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    console.log("request");
    console.log(request);
    //this.id = request.id;
    if (request) {
      this.id = request.id;
      this.imenu = request.imenu;
    }
  }

  ngOnInit() {


    // var temp = [];
    // this.countryService.loadData().subscribe((results) => {
    //   temp.push({ id: 0, name: "No Country" });
    //   results.forEach((element) => {
    //     temp.push({ id: element.id, name: element.name });
    //   });
    // });
    // this.countries = temp;



    
    this.route.params.subscribe(params => {
      console.log("imenuID para:" + this.id);

      this.buildForm();

      if (this.imenu != null)
        this.setForm();
      if (this.imenu == null && this.id > 0) {
        this.imenuService.loadByID(this.id).subscribe(results => {
          this.imenu = results;
          this.setForm();
        });
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.imenu.image != null)
      this.imageControl.setImage(this.imenu.image.data);
  }

  setForm() {

    // this.f.countryID.setValue(this.imenu.countryID);
    this.f.title.setValue(this.imenu.title);
    this.f.titleAr.setValue(this.imenu.titleAr);
    this.f.imageURL.setValue(this.imenu.imageURL);
    this.f.serviceURL.setValue(this.imenu.serviceURL);
    this.f.sortOrder.setValue(this.imenu.sortOrder);
    this.f.active.setValue(this.imenu.active);
  }

  buildForm() {
    this.imenuForm = this.fb.group({
      'ID': [this.id, [
        //Validators.required
      ]],
      // 'countryID': ['', []],
      'title': ['', [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(1)
      ]],
      'titleAr': ['', [
        Validators.maxLength(500),
      ]],
      'imageURL': ['', []],
      'serviceURL': ['', []],
      'sortOrder': ['', []],
      'active': ['', []]
    });

  }

  get f() { return this.imenuForm.controls; }

  save() {
    this.saveData();
  }

  ImageTitle: string = "";
  ImagePath: string = "";
  saveData() {

    var imenu: Imenu = {
      id: this.id,
      // countryID: this.f.countryID.value,
      title: this.f.title.value,
      titleAr: this.f.titleAr.value,
      imageURL: this.f.imageURL.value,
      serviceURL: this.f.serviceURL.value,
      sortOrder: this.f.sortOrder.value,
      active: (this.f.active.value == true) ? true : false
    }

    // ///////////////////////////////////////////////////
    var observer: Observable<any>;
    if (imenu.id == null || imenu.id <= 0)
      observer = this.imenuService.add(imenu);
    else
      observer = this.imenuService.update(imenu);
    observer.subscribe(result => {
      this.id = result.id;
      if (this.imageControl.file)
        this.imageControl.startUpload(result.id, "ID", "Imenu", false, false);

      if (result.id)
        this.snakbar.open('Imenu saved successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
    });

  }

  revert() {
    this.imenuForm.reset();
  }

  onFileComplete(data: any) {

    this.snakbar.open('Image uploaded successfully.', null, {
      duration: 2000,
    });
    console.log("FileComplete");
    console.log(data); // We just print out data bubbled up from event emitter.

    this.ImageTitle = data.ImageTitle;
    this.ImagePath = data.ImagePath;
    //this.saveData();
  }

  requiredFileType(type: string) {
    return function (control: FormControl) {
      const file = control.value;
      if (file) {
        const extension = file.title.split('.')[1].toLowerCase();
        if (type.toLowerCase() !== extension.toLowerCase()) {
          return {
            requiredFileType: true
          };
        }

        return null;
      }
      return null;
    };
  }
}

