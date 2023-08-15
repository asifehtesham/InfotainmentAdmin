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
import { Country } from 'src/app/models/Country';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CountryService } from 'src/app/services/country.service';
import { TemplatesService } from 'src/app/services/templates.service';
import { Templates } from 'src/app/models/Templates';


@Component({
  selector: 'app-countrydetail',
  templateUrl: './countrydetail.component.html',
  styleUrls: ['./countrydetail.component.scss']
})
export class CountrydetailComponent {

  templates: Templates[] = [];
  id: number;
  country: Country;
  countryForm: FormGroup;

  url: string = '';
  done: any;
  isCountrySaved: boolean = true;

  @ViewChild('imagefile', { static: true }) imagefile: ElementRef;
  @ViewChild('imageControl', { static: false }) imageControl: SingleFileUploadComponent;

  editorConfig: any = EditorConfig;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private countryService: CountryService, private snakbar: MatSnackBar, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    console.log("request");
    console.log(request);
    //this.id = request.id;
    if (request) {
      this.id = request.id;
      this.country = request.country;
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log("countryID para:" + this.id);

      this.buildForm();

      if (this.country != null)
        this.setForm();
      if (this.country == null && this.id > 0) {
        this.countryService.loadByID(this.id).subscribe(results => {
          this.country = results;
          this.setForm();
        });
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.country.image != null)
      this.imageControl.setImage(this.country.image.data);
  }

  setForm() {

    this.f.name.setValue(this.country.name);
    this.f.nameAr.setValue(this.country.nameAr);
    this.f.imageURL.setValue(this.country.imageURL);
    this.f.folder.setValue(this.country.folder);
    this.f.sortOrder.setValue(this.country.sortOrder);
    this.f.active.setValue(this.country.active);
  }

  buildForm() {
    this.countryForm = this.fb.group({
      'ID': [this.id, [
        //Validators.required
      ]],
      'name': ['', [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(1)
      ]],
      'nameAr': ['', [
        Validators.maxLength(500),
      ]],
      'imageURL': ['', []],
      'folder': ['', []],
      'sortOrder': ['', []],
      'active': ['', []]
    });

  }

  get f() { return this.countryForm.controls; }

  save() {
    this.saveData();
  }

  ImageTitle: string = "";
  ImagePath: string = "";
  saveData() {

    var country: Country = {
      id: this.id,
      name: this.f.name.value,
      nameAr: this.f.nameAr.value,
      imageURL: this.f.imageURL.value,
      folder: this.f.folder.value,
      sortOrder: this.f.sortOrder.value,
      active: (this.f.active.value == true) ? true : false
    }

    // ///////////////////////////////////////////////////
    var observer: Observable<any>;
    if (country.id == null || country.id <= 0)
      observer = this.countryService.add(country);
    else
      observer = this.countryService.update(country);
    observer.subscribe(result => {
      this.id = result.id;
      if (this.imageControl.file)
        this.imageControl.startUpload(result.id, "ID", "Country", false, false);

      if (result.id)
        this.snakbar.open('Country saved successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
    });

  }

  revert() {
    this.countryForm.reset();
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
        const extension = file.name.split('.')[1].toLowerCase();
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

