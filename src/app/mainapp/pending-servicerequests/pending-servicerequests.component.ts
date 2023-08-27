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
import { ServicerequestDetailComponent } from '../servicerequest-detail/servicerequest-detail.component';

@Component({
  selector: 'app-pending-servicerequest-detail',
  templateUrl: './pending-servicerequests.component.html',
  styleUrls: ['./pending-servicerequests.component.scss']
})
export class PendingServiceRequestComponent {

  templates: Templates[] = [];
  id: number;
  servicerequest: any;
  url: string = '';
  done: any;
  paginatedRooms: any = [];
  page = 0;
  size = 10;
  index: number = 1;
  limit: number = 10;
  isServicerequestSaved: boolean = true;
  room:any
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
      this.room=request.room
      this.servicerequest = request.room.serviceRequest;
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

    console.log("temp", temp);


    this.services = temp;


    var temp1 = [];
    this.roomsService.loadData().subscribe((results) => {
      temp1.push({ id: 0, title: "No Rooms" });
      results.forEach((element) => {
        temp1.push({ id: element.roomNo, title: element.roomNo });
      });
    });
    this.rooms = temp1;

  }
  addServiceRequests() {

    const dialogRef = this.dialog.open(ServicerequestDetailComponent, {
      width: '650px',
      data: { id: 0, room:this.room , servicerequest:this.servicerequest}
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.loadData();
        this.getData({ pageIndex: this.page, pageSize: this.size });
        this.snakbar.open('Service Request saved successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }

    });

  }

  loadData() {
   
    this.roomsService.loadData(this.index, this.limit).subscribe(results => {
      this.paginatedRooms = results
      this.getData({ pageIndex: this.page, pageSize: this.size });
    });
  }

  getData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;

    this.rooms = this.paginatedRooms.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
  }
}

