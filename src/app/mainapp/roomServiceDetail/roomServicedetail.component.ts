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
import { RoomService } from 'src/app/models/RoomService';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { RoomServiceService } from 'src/app/services/roomService.service';
import { TemplatesService } from 'src/app/services/templates.service';
import { Templates } from 'src/app/models/Templates';

@Component({
  selector: 'app-roomServicedetail',
  templateUrl: './roomServicedetail.component.html',
  styleUrls: ['./roomServicedetail.component.scss']
})
export class RoomServicedetailComponent {
  templates: Templates[] = [];
  id: number;
  roomService: RoomService;
  roomServiceForm: FormGroup;

  url: string = '';
  done: any;
  isRoomServiceSaved: boolean = true;


  //ParentroomService: RoomService[];
  @ViewChild('imagefile', { static: true }) imagefile: ElementRef;
  @ViewChild('imageControl', { static: false }) imageControl: SingleFileUploadComponent;

  editorConfig: any = EditorConfig;

  //#region Tag chip
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  todo: any = [];

  @ViewChild('tagInput', { static: false }) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  //#endregion Tag chip

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private roomServiceService: RoomServiceService, private snakbar: MatSnackBar, private dialog: MatDialog, private templatesService: TemplatesService,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    console.log("request");
    console.log(request);
    //this.id = request.id;
    if (request) {
      this.id = request.id;
      this.roomService = request.roomService;
    }
  }

  ngOnInit() {


    this.templatesService.loadData().subscribe(results => {
      results.forEach(element => {
        this.templates.push(element)
      });
    });

    this.route.params.subscribe(params => {
      //this.id = params['id'];
      //this.id = 0;
      console.log("roomServiceID para:" + this.id);

      this.buildForm();

      if (this.roomService != null)
        this.setForm();
      if (this.roomService == null && this.id > 0) {
        this.roomServiceService.loadByID(this.id).subscribe(results => {
          //this.loadEmptyMsg = true;
          this.roomService = results;

          this.setForm();

        });
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.roomService && this.roomService.image)
      this.imageControl.setImage(this.roomService.image.data);
  }

  setForm() {
    this.f.title.setValue(this.roomService.title);
    this.f.titleAr.setValue(this.roomService.titleAr);
    this.f.imageURL.setValue(this.roomService.imageURL);
    this.f.active.setValue(this.roomService.active)

  }

  buildForm() {
    this.roomServiceForm = this.fb.group({
      'ID': [this.id, [
        //Validators.required
      ]],
      'title': ['', [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(1)
      ]],

      'titleAr': ['', [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(1)
      ]],
      'imageURL': ['', []],
      'active': ['', []]
    });

  }

  get f() { return this.roomServiceForm.controls; }
  ImageTitle: string = "";
  ImagePath: string = "";


  save() {

    var roomService: RoomService = {
      id: this.id,
      title: this.f.title.value,
      titleAr: this.f.titleAr.value,
      imageURL: this.f.imageURL.value,
      active:this.f.active.value
    }

    // ///////////////////////////////////////////////////
    var observer: Observable<any>;
    if (roomService.id == null || roomService.id <= 0)
      observer = this.roomServiceService.add(roomService);
    else
      observer = this.roomServiceService.update(roomService);
    observer.subscribe(result => {
      this.id = result.id;
      if (this.imageControl.file)
        this.imageControl.startUpload(result.id, "ID", "RoomService", false, false);

      if (result.id)
        this.snakbar.open('Room Service saved successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
    });

  }

  revert() {
    this.roomServiceForm.reset();
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


  selected(event: MatAutocompleteSelectedEvent): void {

  }

  private _filter(value: string) {

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

  update(data) {
    this.f.content.setValue(data);
  }

}

