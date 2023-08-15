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
import { FeedbackType } from 'src/app/models/FeedbackType';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { FeedbackTypeService } from 'src/app/services/feedbackType.service';
import { TemplatesService } from 'src/app/services/templates.service';
import { Templates } from 'src/app/models/Templates';

@Component({
  selector: 'app-feedback-type-detail',
  templateUrl: './feedback-type-detail.component.html',
  styleUrls: ['./feedback-type-detail.component.scss']
})
export class FeedbackTypeDetailComponent {

  templates: Templates[] = [];
  id: number;
  feedbackType: FeedbackType;
  feedbackTypeForm: FormGroup;

  url: string = '';
  done: any;
  isFeedbackTypeSaved: boolean = true;

  @ViewChild('imagefile', { static: true }) imagefile: ElementRef;
  @ViewChild('imageControl', { static: false }) imageControl: SingleFileUploadComponent;

  editorConfig: any = EditorConfig;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private feedbackTypeService: FeedbackTypeService, private snakbar: MatSnackBar, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    console.log("request");
    console.log(request);
    //this.id = request.id;
    if (request) {
      this.id = request.id;
      this.feedbackType = request.feedbackType;
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log("feedbackTypeID para:" + this.id);

      this.buildForm();

      if (this.feedbackType != null)
        this.setForm();
      if (this.feedbackType == null && this.id > 0) {
        this.feedbackTypeService.loadByID(this.id).subscribe(results => {
          this.feedbackType = results;
          this.setForm();
        });
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.feedbackType.image != null)
      this.imageControl.setImage(this.feedbackType.image.data);
  }

  setForm() {

    this.f.title.setValue(this.feedbackType.title);
    this.f.titleAr.setValue(this.feedbackType.titleAr);
    this.f.imageURL.setValue(this.feedbackType.imageURL);
    this.f.sortOrder.setValue(this.feedbackType.sortOrder);
    this.f.active.setValue(this.feedbackType.active);
  }

  buildForm() {
    this.feedbackTypeForm = this.fb.group({
      'ID': [this.id, [
        //Validators.required
      ]],
      'title': ['', [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(1)
      ]],
      'titleAr': ['', [
        Validators.maxLength(500),
      ]],
      'imageURL': ['', []],
      'sortOrder': ['', []],
      'active': ['', []]
    });

  }

  get f() { return this.feedbackTypeForm.controls; }

  save() {
    this.saveData();
  }

  ImageTitle: string = "";
  ImagePath: string = "";
  saveData() {

    var feedbackType: FeedbackType = {
      id: this.id,
      title: this.f.title.value,
      titleAr: this.f.titleAr.value,
      imageURL: this.f.imageURL.value,
      sortOrder: this.f.sortOrder.value,
      active: (this.f.active.value == true) ? true : false
    }

    // ///////////////////////////////////////////////////
    var observer: Observable<any>;
    if (feedbackType.id == null || feedbackType.id <= 0)
      observer = this.feedbackTypeService.add(feedbackType);
    else
      observer = this.feedbackTypeService.update(feedbackType);
    observer.subscribe(result => {
      this.id = result.id;
      if (this.imageControl.file)
        this.imageControl.startUpload(result.id, "ID", "FeedbackType", false, false);

      if (result.id)
        this.snakbar.open('FeedbackType saved successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
    });

  }

  revert() {
    this.feedbackTypeForm.reset();
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

