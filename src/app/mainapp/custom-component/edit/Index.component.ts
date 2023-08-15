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
import { Page } from 'src/app/models/Page';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { PagesService } from 'src/app/services/pages.service';

@Component({
  selector: 'app-pagedetail',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class Index {

  id: number;
  page: Page;
  pageForm: FormGroup;

  url: string = '';
  done: any;
  isPageSaved: boolean = true;

  pageTemplate: SelectModel[] = [
    { id: '0', viewValue: 'Empty' },
    { id: '1', viewValue: 'Template 1' },
    { id: '2', viewValue: 'Template 2' }
  ];

  //Parentpage: Page[];
  @ViewChild('imagefile', { static: true }) imagefile: ElementRef;
  @ViewChild('imageControl', { static: false }) imageControl: SingleFileUploadComponent;

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

  constructor(private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private pageService: PagesService, private snakbar: MatSnackBar, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    console.log("request");
    console.log(request);
    //this.id = request.id;

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
      this.id = params['id'];
      //this.id = 0;
      console.log("pageID para:" + this.id);

      this.buildForm();

      if (this.id > 0) {
        this.pageService.loadByID(this.id).subscribe(results => {
          //this.loadEmptyMsg = true;
          this.page = results;
          this.f.slug.setValue(this.page.slug);
          this.f.title.setValue(this.page.title);
          this.f.CurrentVersion.setValue(this.page.currentVersion);
          this.f.Template.setValue(this.page.SelectedTemplate);
          //this.f.isPublish.setValue(this.page.isPublish);
          //this.f.IsActive.setValue(this.page.IsActive);

        });

        //this.loadPageQuestion();
      }
    });
  }

  // loadPageQuestion() {
  //   this.questionService.getPageQuestions(this.pageID).subscribe(results => {
  //     //this.loadEmptyMsg = true;
  //     console.log('come to the subscriber');
  //     this.selectedQuestions = results;
  //   });
  // }

  buildForm() {
    console.log("build form ");
    this.pageForm = this.fb.group({
      'ID': [this.id, [
        //Validators.required
      ]],
      'slug': ['', [
        Validators.maxLength(5000)
      ]],
      'Title': ['', [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(1)
      ]],
      'Template': ['', [
        //Validators.maxLength(500)
      ]],
      // 'isPublish': ['', [

      // ]],
    });

  }

  get f() { return this.pageForm.controls; }

  save() {
    console.log('save call');


    return this.router.navigate(['/mainapp/designer']);  

    //this.saveData();
  }

  ImageTitle: string = "";
  ImagePath: string = "";
  saveData() {

    var page: Page = {

      id: this.id,
      title: this.f.title.value,
      slug: this.f.slug.value,
      SelectedTemplate: this.f.Template.value,
      isPublish: false,
      //isPublish: this.f.isPublish.value,
      IsActive: this.f.IsActive.value,

    }
    this.pageService.add(page).subscribe(result => {
      this.id = result.id;

      if (this.imageControl.file)
        this.imageControl.startUpload(result.id.toString(), "ID", "Page", false, false);

      // if (this.id > 0)
      //   this.loadPageQuestion();
    });
  }

  revert() {
    this.pageForm.reset();
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

