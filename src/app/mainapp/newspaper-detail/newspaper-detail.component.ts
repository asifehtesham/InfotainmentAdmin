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
import { NewsPaper } from 'src/app/models/NewsPaper';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { NewsPaperService } from 'src/app/services/newsPaper.service';
import { TemplatesService } from 'src/app/services/templates.service';
import { Templates } from 'src/app/models/Templates';


import { CountryService } from 'src/app/services/country.service';


@Component({
  selector: 'app-newspaper-detail',
  templateUrl: './newspaper-detail.component.html',
  styleUrls: ['./newspaper-detail.component.scss']
})
export class NewspaperDetailComponent {

  templates: Templates[] = [];
  id: number;
  newsPaper: NewsPaper;
  newsPaperForm: FormGroup;

  url: string = '';
  done: any;
  isNewsPaperSaved: boolean = true;

  
  countries: SelectModel[];


  @ViewChild('imagefile', { static: true }) imagefile: ElementRef;
  @ViewChild('imageControl', { static: false }) imageControl: SingleFileUploadComponent;

  editorConfig: any = EditorConfig;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private newsPaperService: NewsPaperService, private snakbar: MatSnackBar, private dialog: MatDialog,
    private countryService: CountryService,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    console.log("request");
    console.log(request);
    //this.id = request.id;
    if (request) {
      this.id = request.id;
      this.newsPaper = request.newsPaper;
    }
  }

  ngOnInit() {




    
    var temp = [];
    this.countryService.loadData().subscribe((results) => {
      temp.push({ id: 0, name: "No Country" });
      results.forEach((element) => {
        temp.push({ id: element.id, name: element.name });
      });
    });
    this.countries = temp;

    this.route.params.subscribe(params => {
      console.log("newsPaperID para:" + this.id);

      this.buildForm();

      if (this.newsPaper != null)
        this.setForm();
      if (this.newsPaper == null && this.id > 0) {
        this.newsPaperService.loadByID(this.id).subscribe(results => {
          this.newsPaper = results;
          this.setForm();
        });
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.newsPaper.image != null)
      this.imageControl.setImage(this.newsPaper.image.data);
  }

  setForm() {

    this.f.countryID.setValue(this.newsPaper.countryID);
    this.f.title.setValue(this.newsPaper.title);
    this.f.titleAr.setValue(this.newsPaper.titleAr);
    this.f.imageURL.setValue(this.newsPaper.imageURL);
    this.f.serviceURL.setValue(this.newsPaper.serviceURL);
    this.f.sortOrder.setValue(this.newsPaper.sortOrder);
    this.f.active.setValue(this.newsPaper.active);
  }

  buildForm() {
    this.newsPaperForm = this.fb.group({
      'ID': [this.id, [
        //Validators.required
      ]],
      'countryID': ['', []],
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

  get f() { return this.newsPaperForm.controls; }

  save() {
    this.saveData();
  }

  ImageTitle: string = "";
  ImagePath: string = "";
  saveData() {

    var newsPaper: NewsPaper = {
      id: this.id,
      countryID: this.f.countryID.value,
      title: this.f.title.value,
      titleAr: this.f.titleAr.value,
      imageURL: this.f.imageURL.value,
      serviceURL: this.f.serviceURL.value,
      sortOrder: this.f.sortOrder.value,
      active: (this.f.active.value == true) ? true : false
    }

    // ///////////////////////////////////////////////////
    var observer: Observable<any>;
    if (newsPaper.id == null || newsPaper.id <= 0)
      observer = this.newsPaperService.add(newsPaper);
    else
      observer = this.newsPaperService.update(newsPaper);
    observer.subscribe(result => {
      this.id = result.id;
      if (this.imageControl.file)
        this.imageControl.startUpload(result.id, "ID", "NewsPaper", false, false);

      if (result.id)
        this.snakbar.open('NewsPaper saved successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
    });

  }

  revert() {
    this.newsPaperForm.reset();
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

