import { Component, OnInit, ViewChild, ElementRef, Input, Inject, AfterViewInit } from '@angular/core';
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
import { Form } from 'src/app/models/Form';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { FormService } from 'src/app/services/form.service';


@Component({
  selector: 'app-form-detail',
  templateUrl: './form-detail.component.html',
  styleUrls: ['./form-detail.component.scss']
})

export class FormDetailComponent implements OnInit, AfterViewInit {

  id: number;
  form: Form;
  formForm: FormGroup;

  url: string = '';
  done: any;
  isFormSaved: boolean = true;

  //Parentform: Form[];

  editorConfig: any = EditorConfig;

  //#region Tag chip
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tags: string[] = [];
  allTags: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  todo: any = [];

  @ViewChild('tagInput', { static: false }) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  //#endregion Tag chip

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private formService: FormService, private snakbar: MatSnackBar, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    console.log("request");
    console.log(request);
    if (request) {
      this.id = request.id;
      this.form = request.form;
    }

    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => tag ? this._filter(tag) : this.allTags.slice()));
  }

  ngOnInit() {
    // this.questionService.loadData().subscribe(results => {
    //   //this.loadEmptyMsg = true;
    //   console.log('come to the subscriber');
    //   this.availableQuestions = results;
    // });

    this.route.params.subscribe(params => {

      //this.id = params['id'];
      //this.id = 0;
      console.log("formID para:" + this.id);

      this.buildForm();

      if (this.form != null)
        this.setForm();
      if (this.form == null && this.id > 0) {
        this.formService.loadByID(this.id).subscribe(results => {
          //this.loadEmptyMsg = true;
          this.form = results;
          this.setForm();

        });

        //this.loadFormQuestion();
      }
    });
  }
  ngAfterViewInit(): void {
  }

  setForm() {
    this.f.Slug.setValue(this.form.slug);
    this.f.Title.setValue(this.form.title);
    //this.f.CurrentVersion.setValue(this.form.currentVersion);
    // this.f.CurrentVersion.setValue(this.form.currentVersion);
    // this.f.PublishedVersion.setValue(this.form.publishedVersion);
    // this.f.AvailableVersion.setValue(this.form.availableVersion);
    this.f.isPublish.setValue(this.form.isPublish);
    //this.f.IsActive.setValue(this.form.IsActive);


  }
  // loadFormQuestion() {
  //   this.questionService.getFormQuestions(this.formID).subscribe(results => {
  //     //this.loadEmptyMsg = true;
  //     console.log('come to the subscriber');
  //     this.selectedQuestions = results;
  //   });
  // }

  buildForm() {
    console.log("build form ");
    this.formForm = this.fb.group({
      'ID': [this.id, [
        //Validators.required
      ]],

      'Slug': ['', [
        Validators.maxLength(5000)
      ]],
      'Title': ['', [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(1)
      ]],
      // 'CurrentVersion': ['', [
      //   Validators.maxLength(50)
      // ]],
      // 'PublishedVersion': ['', [
      //   Validators.maxLength(50)
      // ]],
      // 'AvailableVersion': ['', [
      //   Validators.maxLength(50)
      // ]],

      'isPublish': [false, []]
    });

  }

  get f() { return this.formForm.controls; }

  save() {
    console.log('save call');


    this.saveData();
  }

  saveData() {

    if (this.form == null) {
      this.form = {
        id: this.id,
        title: this.f.Title.value,
        slug: this.f.Slug.value,
        // currentVersion: this.f.CurrentVersion.value,
        // publishedVersion: this.f.PublishedVersion.value,
        // availableVersion: this.f.AvailableVersion.value,
        isPublish: this.f.isPublish.value
      }
    }
    else {
      this.form.title = this.f.Title.value;
      this.form.slug = this.f.Slug.value;
      this.form.isPublish = this.f.isPublish.value;
    }

    var observer: Observable<any>;
    if (this.form.id == null || this.form.id <= 0)
      observer = this.formService.add(this.form);
    else
      observer = this.formService.edit(this.form);

    observer.subscribe(result => {
      console.log("Response from server:");
      console.log(result);
      console.log(result.id);
      this.id = result.id;
    });
  }

  revert() {
    this.formForm.reset();
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

  onAdd() {
    // const dialogRef = this.dialog.open(SectionAddComponent, {
    //   width: '650px',
    //   data: 0
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }

  //#region Chip
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our tag
    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
  }
  //#endregion Chip.


  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  topics_selectionChange(question) { }

}

