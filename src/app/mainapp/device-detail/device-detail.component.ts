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
import { Device } from 'src/app/models/Device';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { DeviceService } from 'src/app/services/device.service';
import { TemplatesService } from 'src/app/services/templates.service';
import { Templates } from 'src/app/models/Templates';
import { FloorService } from 'src/app/services/floor.service';

@Component({
  selector: 'app-device-detail',
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.scss']
})
export class DeviceDetailComponent {

  templates: Templates[] = [];
  id: number;
  device: Device;
  deviceForm: FormGroup;

  url: string = '';
  done: any;
  isDeviceSaved: boolean = true;

  deviceType = [
    { id: 'light', title: 'Light' }, 
    { id: 'elight', title: 'Emergency light' },
    { id: 'ac', title: 'Ac' },
    { id: 'curtains', title: 'Curtains' },
    { id: 'tv', title: 'Tv' }
  
  ];

  @ViewChild('imagefile', { static: true }) imagefile: ElementRef;
  @ViewChild('imageControl', { static: false }) imageControl: SingleFileUploadComponent;

  editorConfig: any = EditorConfig;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private deviceService: DeviceService, private snakbar: MatSnackBar, private dialog: MatDialog,
    private floorService: FloorService,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    console.log("request");
    console.log(request);
    //this.id = request.id;
    if (request) {
      this.id = request.id;
      this.device = request.device;
    }
  }

  ngOnInit() {









    this.route.params.subscribe(params => {
      console.log("deviceID para:" + this.id);

      this.buildForm();

      if (this.device != null)
        this.setForm();
      if (this.device == null && this.id > 0) {
        this.deviceService.loadByID(this.id).subscribe(results => {
          this.device = results;
          this.setForm();
        });
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.device.image != null)
      this.imageControl.setImage(this.device.image.data);
  }

  setForm() {

    this.f.title.setValue(this.device.title);
    this.f.titleAr.setValue(this.device.titleAr);
    this.f.imageURL.setValue(this.device.imageURL);
    this.f.deviceType.setValue(this.device.deviceType);
    this.f.sortOrder.setValue(this.device.sortOrder);
    this.f.active.setValue(this.device.active);
  }

  buildForm() {
    this.deviceForm = this.fb.group({
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
      'deviceType': ['', []],
      'sortOrder': ['', []],
      'active': ['', []]
    });

  }

  get f() { return this.deviceForm.controls; }

  save() {
    this.saveData();
  }

  ImageTitle: string = "";
  ImagePath: string = "";
  saveData() {

    var device: Device = {
      id: this.id,
      title: this.f.title.value,
      titleAr: this.f.titleAr.value,
      imageURL: this.f.imageURL.value,
      deviceType: this.f.deviceType.value,
      sortOrder: this.f.sortOrder.value,
      active: (this.f.active.value == true) ? true : false
    }

    // ///////////////////////////////////////////////////
    var observer: Observable<any>;
    if (device.id == null || device.id <= 0)
      observer = this.deviceService.add(device);
    else
      observer = this.deviceService.update(device);
    observer.subscribe(result => {
      this.id = result.id;
      if (this.imageControl.file)
        this.imageControl.startUpload(result.id, "ID", "Device", false, false);

      if (result.id)
        this.snakbar.open('Device saved successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
    });

  }

  revert() {
    this.deviceForm.reset();
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

