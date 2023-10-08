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
import { Rooms } from 'src/app/models/Rooms';
import { AnyMxRecord } from 'node:dns';

@Component({
  selector: 'app-servicerequest-detail',
  templateUrl: './servicerequest-detail.component.html',
  styleUrls: ['./servicerequest-detail.component.scss']
})
export class ServicerequestDetailComponent {

  templates: Templates[] = [];
  id: number;
  servicerequest: any;
  servicerequestForm: FormGroup;
  roomShow:boolean=true;
  url: string = '';
  done: any;
  isServicerequestSaved: boolean = true;
  services: any;
  rooms: any= [];
  room:any
  selectedroom:any
  requestStatus = [
    { id: 0, title: 'Pending' },
    { id: 1, title: 'InProgress' },
    { id: 2, title: 'Closed' },
    { id: 3, title: 'Rejected' },
    { id: 4, title: 'CancelledByPatient' }
  ]

  editorConfig: any = EditorConfig;
  constructor(private route: ActivatedRoute, private fb: FormBuilder, private servicerequestService: ServicerequestService, private roomServiceService: RoomServiceService, private snakbar: MatSnackBar,
    private roomsService: RoomsService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    if (request) {
      console.log("request",request)
      if(request.room){
        this.room=request.room
        this.roomShow=false        
      }else{
        this.room=request.data.room
        this.roomShow=true                
      }
      this.id = request.data.id;
      this.servicerequest = request.data
    }
  }

  ngOnInit() {
    
    this.roomServiceService.loadData().subscribe((results) => {
      this.services=results
    });
    this.roomsService.loadData().subscribe((results) => {
      this.rooms= results 
      this.rooms.forEach(element => {
        if(element.roomNo==this.room.roomNo){
          this.selectedroom = element
        }
      });
    }); 
    
    // this.route.params.subscribe(params => {

      this.buildForm();

      // if (this.servicerequest != null)
     
        // this.setForm();
      // if (this.servicerequest == null && this.id > 0) {
        // this.servicerequestService.loadByID(this.id).subscribe(results => {
          // this.servicerequest = results;
          this.setForm();
        // });
      // }
    // });
  }

  selectRoom(room){
    this.room=room
  }

  setForm() {
    this.f.serviceId.setValue(this.servicerequest.serviceId);
    this.f.request.setValue(this.servicerequest.request);
    this.f.status.setValue(this.servicerequest.status);
    // this.room=this.servicerequest.room
  }

  buildForm() {
    this.servicerequestForm = this.fb.group({
      'ID': [this.id, [
        //Validators.required
      ]], 
      'serviceId': ['', []],
      'request': ['', []],
      'status': ['', []]
    });
  }

  get f() { return this.servicerequestForm.controls; }

  save() {
    this.saveData();
  }
  saveData() {
    var servicerequest = {
      ID:this.id,
      patientId: this.room.currentAdmission?this.room.currentAdmission.fileNo:'0',
      serviceId: this.f.serviceId.value,
      roomNo:   this.room?this.room.roomNo:'0',
      request:  this.f.request.value,
      status: this.f.status.value?this.f.status.value:0,
      assignedTo: 0,
      admissionNo:  this.room.currentAdmission?this.room.currentAdmission.admissionNo:'0',
      patientName:  this.room.currentAdmission?this.room.currentAdmission.patientName:'0'
    }
    // ///////////////////////////////////////////////////
    var observer: Observable<any>;
    if (this.id == null || this.id <= 0)
      observer = this.servicerequestService.add(servicerequest);
    else
      observer = this.servicerequestService.update(servicerequest);
      observer.subscribe(result => {
        this.id = result.id;
        if (result) 
          this.snakbar.open('Service Request saved successfully.', 'Dismise', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
      });
  }
  revert() {
    this.servicerequestForm.reset();
  }
}