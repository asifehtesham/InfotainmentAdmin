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
import { SocialMedia } from 'src/app/models/SocialMedia';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { SocialMediaService } from 'src/app/services/socialMedia.service';
import { TemplatesService } from 'src/app/services/templates.service';
import { Templates } from 'src/app/models/Templates';

@Component({
  selector: 'app-social-media-detail',
  templateUrl: './social-media-detail.component.html',
  styleUrls: ['./social-media-detail.component.scss']
})
export class SocialMediaDetailComponent {
  templates: Templates[] = [];
  id: number;
  socialMedia: SocialMedia;
  socialMediaForm: FormGroup;

  url: string = '';
  done: any;
  isSocialMediaSaved: boolean = true;

  @ViewChild('imagefile', { static: true }) imagefile: ElementRef;
  @ViewChild('imageControl', { static: false }) imageControl: SingleFileUploadComponent;

  editorConfig: any = EditorConfig;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private socialMediaService: SocialMediaService, private snakbar: MatSnackBar, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    console.log("request");
    console.log(request);
    //this.id = request.id;
    if (request) {
      this.id = request.id;
      this.socialMedia = request.socialMedia;
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log("socialMediaID para:" + this.id);

      this.buildForm();

      if (this.socialMedia != null)
        this.setForm();
      if (this.socialMedia == null && this.id > 0) {
        this.socialMediaService.loadByID(this.id).subscribe(results => {
          this.socialMedia = results;
          this.setForm();
        });
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.socialMedia.image != null)
      this.imageControl.setImage(this.socialMedia.image.data);
  }

  setForm() {

    this.f.typeID.setValue(this.socialMedia.typeID);
    this.f.title.setValue(this.socialMedia.title);
    this.f.titleAr.setValue(this.socialMedia.titleAr);
    this.f.imageURL.setValue(this.socialMedia.imageURL);
    this.f.serviceURL.setValue(this.socialMedia.serviceURL);
    this.f.sortOrder.setValue(this.socialMedia.sortOrder);
    this.f.active.setValue(this.socialMedia.active);
  }

  buildForm() {
    this.socialMediaForm = this.fb.group({
      'ID': [this.id, [
        //Validators.required
      ]],
      'typeID': ['', []],
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

  get f() { return this.socialMediaForm.controls; }

  save() {
    this.saveData();
  }

  ImageTitle: string = "";
  ImagePath: string = "";
  saveData() {

    var socialMedia: SocialMedia = {
      id: this.id,
      typeID: this.f.typeID.value,
      title: this.f.title.value,
      titleAr: this.f.titleAr.value,
      imageURL: this.f.imageURL.value,
      serviceURL: this.f.serviceURL.value,
      sortOrder: this.f.sortOrder.value,
      active: (this.f.active.value == true) ? true : false
    }

    // ///////////////////////////////////////////////////
    var observer: Observable<any>;
    if (socialMedia.id == null || socialMedia.id <= 0)
      observer = this.socialMediaService.add(socialMedia);
    else
      observer = this.socialMediaService.update(socialMedia);
    observer.subscribe(result => {
      this.id = result.id;
      if (this.imageControl.file)
        this.imageControl.startUpload(result.id, "ID", "SocialMedia", false, false);

      if (result.id)
        this.snakbar.open('SocialMedia saved successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
    });

  }

  revert() {
    this.socialMediaForm.reset();
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

