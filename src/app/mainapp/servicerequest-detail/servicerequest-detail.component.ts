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
import { Servicerequest } from 'src/app/models/Servicerequest';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { ServicerequestService } from 'src/app/services/servicerequest.service';
import { TemplatesService } from 'src/app/services/templates.service';
import { Templates } from 'src/app/models/Templates';
import { BranchService } from 'src/app/services/branch.service';
import { RoomServiceService } from 'src/app/services/roomService.service';
import { RoomsService } from 'src/app/services/rooms.service';

@Component({
  selector: 'app-servicerequest-detail',
  templateUrl: './servicerequest-detail.component.html',
  styleUrls: ['./servicerequest-detail.component.scss']
})
export class ServicerequestDetailComponent {

  templates: Templates[] = [];
  id: number;
  servicerequest: Servicerequest;
  servicerequestForm: FormGroup;

  url: string = '';
  done: any;
  isServicerequestSaved: boolean = true;

  services: SelectModel[];
  rooms: SelectModel[];
  requestStatus = [
    { id: 0, title: 'Pending' },
    { id: 1, title: 'InProgress' },
    { id: 2, title: 'Closed' },
    { id: 3, title: 'Rejected' },
    { id: 4, title: 'CancelledByPatient' }
  ]

  @ViewChild('imagefile', { static: true }) imagefile: ElementRef;
  @ViewChild('imageControl', { static: false }) imageControl: SingleFileUploadComponent;

  editorConfig: any = EditorConfig;




  constructor(private route: ActivatedRoute, private fb: FormBuilder, private servicerequestService: ServicerequestService, private roomServiceService: RoomServiceService, private snakbar: MatSnackBar,
    private roomsService: RoomsService,

    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    console.log("request");
    console.log(request);
    //this.id = request.id;
    if (request) {

      console.log("request.=.=.=",request);

      this.id = request.id;
      this.servicerequest = request.servicerequest;
    }
  }

  ngOnInit() {




    var temp = [];
    this.roomServiceService.loadData().subscribe((results) => {
      temp.push({ id: 0, title: "No Service" });
      results.forEach((element) => {
        temp.push({ id: element.id, title: element.title });
      });
    });
    
    console.log("temp",temp);

    
    this.services = temp;


    var temp1 = [];
    this.roomsService.loadData().subscribe((results) => {
      temp1.push({ id: 0, title: "No Rooms" });
      results.forEach((element) => {
        temp1.push({ id: element.roomNo, title: element.roomNo });
      });
    });
    this.rooms = temp1;





    
  



    this.route.params.subscribe(params => {
      console.log("servicerequestID para:" + this.id);

      this.buildForm();

      if (this.servicerequest != null)
        this.setForm();
      if (this.servicerequest == null && this.id > 0) {
        this.servicerequestService.loadByID(this.id).subscribe(results => {
          this.servicerequest = results;
          this.setForm();
        });
      }
    });
  }


  setForm() {

    this.f.patientId.setValue(this.servicerequest.patientId);
    this.f.serviceId.setValue(this.servicerequest.serviceId);
    this.f.roomNo.setValue(this.servicerequest.roomNo);
    this.f.request.setValue(this.servicerequest.request);
    this.f.status.setValue(this.servicerequest.status);
    this.f.assignedTo.setValue(0);
    this.f.admissionNo.setValue(this.servicerequest.admissionNo);
    this.f.patientName.setValue(this.servicerequest.patientName);
  

    


  
  }

  buildForm() {
    this.servicerequestForm = this.fb.group({
      'ID': [this.id, [
        //Validators.required
      ]],
      // 'title': ['', [
      //   Validators.required,
      //   Validators.maxLength(500),
      //   Validators.minLength(1)
      // ]],
      // 'titleAr': ['', [
      //   Validators.maxLength(500),
      // ]],
      'patientId': ['', []],
      'serviceId': ['', []],
      'roomNo': ['', []],
      'request': ['', []],
      'status': ['', []],
      'assignedTo': ['', []],
      'admissionNo': ['', []],
      'patientName': ['', []],
      'sortOrder': ['', []],
    });

  }

  get f() { return this.servicerequestForm.controls; }

  save() {
    this.saveData();
  }

  ImageTitle: string = "";
  ImagePath: string = "";
  saveData() {

    var servicerequest: Servicerequest = {

      patientId: this.f.patientId.value,
      serviceId: this.f.serviceId.value,
      roomNo:  this.f.roomNo.value,
      request: this.f.request.value,
      status: this.f.status.value,
      assignedTo: 0,
      admissionNo: this.f.admissionNo.value,
      patientName: this.f.patientName.value,
      

      


    }

    // ///////////////////////////////////////////////////
    var observer: Observable<any>;


    console.log("servicerequest.id....",servicerequest.id);



    if (this.id == null || this.id <= 0)
      observer = this.servicerequestService.add(servicerequest);
    else
      observer = this.servicerequestService.update(servicerequest);
    observer.subscribe(result => {
      this.id = result.id;
      if (this.imageControl.file)
        this.imageControl.startUpload(result.id, "ID", "Servicerequest", false, false);

      if (result.id)
        this.snakbar.open('Servicerequest saved successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
    });

  }

  revert() {
    this.servicerequestForm.reset();
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

