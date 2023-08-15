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
import { Magazine } from 'src/app/models/Magazine';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { MagazineService } from 'src/app/services/magazine.service';
import { TemplatesService } from 'src/app/services/templates.service';
import { Templates } from 'src/app/models/Templates';

@Component({
  selector: 'app-magazine-detail',
  templateUrl: './magazine-detail.component.html',
  styleUrls: ['./magazine-detail.component.scss']
})
export class MagazineDetailComponent {

  templates: Templates[] = [];
  id: number;
  magazine: Magazine;
  magazineForm: FormGroup;

  url: string = '';
  done: any;
  isMagazineSaved: boolean = true;

  @ViewChild('imagefile', { static: true }) imagefile: ElementRef;
  @ViewChild('imageControl', { static: false }) imageControl: SingleFileUploadComponent;

  editorConfig: any = EditorConfig;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private magazineService: MagazineService, private snakbar: MatSnackBar, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    console.log("request");
    console.log(request);
    //this.id = request.id;
    if (request) {
      this.id = request.id;
      this.magazine = request.magazine;
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log("magazineID para:" + this.id);

      this.buildForm();

      if (this.magazine != null)
        this.setForm();
      if (this.magazine == null && this.id > 0) {
        this.magazineService.loadByID(this.id).subscribe(results => {
          this.magazine = results;
          this.setForm();
        });
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.magazine.image != null)
      this.imageControl.setImage(this.magazine.image.data);
  }

  setForm() {

    this.f.countryID.setValue(this.magazine.countryID);
    this.f.title.setValue(this.magazine.title);
    this.f.titleAr.setValue(this.magazine.titleAr);
    this.f.imageURL.setValue(this.magazine.imageURL);
    this.f.serviceURL.setValue(this.magazine.serviceURL);
    this.f.sortOrder.setValue(this.magazine.sortOrder);
    this.f.active.setValue(this.magazine.active);
  }

  buildForm() {
    this.magazineForm = this.fb.group({
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

  get f() { return this.magazineForm.controls; }

  save() {
    this.saveData();
  }

  ImageTitle: string = "";
  ImagePath: string = "";
  saveData() {

    var magazine: Magazine = {
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
    if (magazine.id == null || magazine.id <= 0)
      observer = this.magazineService.add(magazine);
    else
      observer = this.magazineService.update(magazine);
    observer.subscribe(result => {
      this.id = result.id;
      if (this.imageControl.file)
        this.imageControl.startUpload(result.id, "ID", "Magazine", false, false);

      if (result.id)
        this.snakbar.open('Magazine saved successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
    });

  }

  revert() {
    this.magazineForm.reset();
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

