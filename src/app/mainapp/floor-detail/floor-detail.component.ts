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
import { Floor } from 'src/app/models/Floor';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { FloorService } from 'src/app/services/floor.service';
import { TemplatesService } from 'src/app/services/templates.service';
import { Templates } from 'src/app/models/Templates';

@Component({
  selector: 'app-floor-detail',
  templateUrl: './floor-detail.component.html',
  styleUrls: ['./floor-detail.component.scss']
})
export class FloorDetailComponent {

  templates: Templates[] = [];
  id: number;
  floor: Floor;
  floorForm: FormGroup;

  url: string = '';
  done: any;
  isFloorSaved: boolean = true;

  @ViewChild('imagefile', { static: true }) imagefile: ElementRef;
  @ViewChild('imageControl', { static: false }) imageControl: SingleFileUploadComponent;

  editorConfig: any = EditorConfig;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private floorService: FloorService, private snakbar: MatSnackBar, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    console.log("request");
    console.log(request);
    //this.id = request.id;
    if (request) {
      this.id = request.id;
      this.floor = request.floor;
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log("floorID para:" + this.id);

      this.buildForm();

      if (this.floor != null)
        this.setForm();
      if (this.floor == null && this.id > 0) {
        this.floorService.loadByID(this.id).subscribe(results => {
          this.floor = results;
          this.setForm();
        });
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.floor.image != null)
      this.imageControl.setImage(this.floor.image.data);
  }

  setForm() {

    this.f.title.setValue(this.floor.title);
    this.f.titleAr.setValue(this.floor.titleAr);
    this.f.imageURL.setValue(this.floor.imageURL);
    this.f.sortOrder.setValue(this.floor.sortOrder);
    this.f.active.setValue(this.floor.active);
  }

  buildForm() {
    this.floorForm = this.fb.group({
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

  get f() { return this.floorForm.controls; }

  save() {
    this.saveData();
  }

  ImageTitle: string = "";
  ImagePath: string = "";
  saveData() {

    var floor: Floor = {
      id: this.id,
      title: this.f.title.value,
      titleAr: this.f.titleAr.value,
      imageURL: this.f.imageURL.value,
      sortOrder: this.f.sortOrder.value,
      active: (this.f.active.value == true) ? true : false
    }

    // ///////////////////////////////////////////////////
    var observer: Observable<any>;
    if (floor.id == null || floor.id <= 0)
      observer = this.floorService.add(floor);
    else
      observer = this.floorService.update(floor);
    observer.subscribe(result => {
      this.id = result.id;
      if (this.imageControl.file)
        this.imageControl.startUpload(result.id, "ID", "Floor", false, false);

      if (result.id)
        this.snakbar.open('Floor saved successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
    });

  }

  revert() {
    this.floorForm.reset();
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

