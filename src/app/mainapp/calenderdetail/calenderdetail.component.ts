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
import { Events } from 'src/app/models/Events';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from 'src/app/services/events.service';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-calenderdetail',
  templateUrl: './calenderdetail.component.html',
  styleUrls: ['./calenderdetail.component.scss']
})
export class CalenderdetailComponent implements OnInit, AfterViewInit {

  id: number;
  events: Events;
  eventsForm: FormGroup;

  url: string = '';
  done: any;
  isEventsSaved: boolean = true;

  eventsTemplate: SelectModel[] = [
    { id: '0', viewValue: 'Empty' },
    { id: '1', viewValue: 'Template 1' },
    { id: '2', viewValue: 'Template 2' }
  ];

  //Parentevents: Events[];
  // @ViewChild('imagefile', { static: true }) imagefile: ElementRef;
  // @ViewChild('imageControl', { static: false }) imageControl: SingleFileUploadComponent;

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

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private eventsService: EventsService, private snakbar: MatSnackBar, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    console.log("request");
    console.log(request);
    if (request) {
      this.id = request.id;
      this.events = request.events;
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
      console.log("eventsID para:" + this.id);

      this.buildForm();

      if (this.events != null)
        this.setForm();
      if (this.events == null && this.id > 0) {
        this.eventsService.loadByID(this.id).subscribe(results => {
          //this.loadEmptyMsg = true;
          this.events = results;
          this.setForm();

        });

        //this.loadEventsQuestion();
      }
    });
  }
  ngAfterViewInit(): void {
    // if (this.events != null)
    //   this.imageControl.setImage(this.events.image.data);
  }

  setForm() {
    this.f.Description.setValue(this.events.description);
    this.f.Color.setValue(this.events.color);
    this.f.Title.setValue(this.events.title);
    //this.f.CurrentVersion.setValue(this.events.currentVersion);
    this.f.AllDay.setValue(this.events.allDay);
    this.f.StartDate.setValue(this.events.startDate.toISODate());
    this.f.EndDate.setValue(this.events.endDate.toISODate());
    //this.f.isPublish.setValue(this.events.isPublish);
    //this.f.IsActive.setValue(this.events.IsActive);


  }
  // loadEventsQuestion() {
  //   this.questionService.getEventsQuestions(this.eventsID).subscribe(results => {
  //     //this.loadEmptyMsg = true;
  //     console.log('come to the subscriber');
  //     this.selectedQuestions = results;
  //   });
  // }

  buildForm() {
    console.log("build form ");
    this.eventsForm = this.fb.group({
      'ID': [this.id, [
        //Validators.required
      ]],
      'Description': ['', [
        Validators.maxLength(5000)
      ]],
      'Color': ['', [
        Validators.maxLength(50)
      ]],
      'Title': ['', [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(1)
      ]],
      'StartDate': ["", []],
      'EndDate': ["", []],
      'AllDay': [false, []]
    });

  }

  get f() { return this.eventsForm.controls; }

  save() {
    console.log('save call');


    this.saveData();
  }

  ImageTitle: string = "";
  ImagePath: string = "";
  saveData() {

    var events: Events = {

      id: this.id,
      title: this.f.Title.value,
      description: this.f.Description.value,
      color: this.f.Color.value,
      allDay: this.f.AllDay.value,
      startDate: this.f.StartDate.value,
      endDate: this.f.EndDate.value,

      isPublish: false,
      //isPublish: this.f.isPublish.value,
      //IsActive: this.f.IsActive.value,

    }
    var observer: Observable<any>;
    if (events.id == null || events.id <= 0)
      observer = this.eventsService.add(events);
    else
      observer = this.eventsService.edit(events);

    observer.subscribe(result => {
      console.log("Response from server:");
      console.log(result);
      console.log(result.id);
      this.id = result.id;

      // if (this.imageControl.file)
      //   this.imageControl.startUpload(result.id, "ID", "Events", false, false);

      // if (this.id > 0)
      //   this.loadEventsQuestion();
    });
  }

  revert() {
    this.eventsForm.reset();
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

