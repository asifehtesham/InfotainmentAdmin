import { Component, OnInit, ViewChild } from '@angular/core';
//import { MatPaginator, MatTableDataSource, MatSortable, MatSortHeader, MatSort, MatFormFieldControl, MatInputModule,MatDatepickerInputEvent, MatSlideToggleChange } from "@angular/material";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Rooms } from 'src/app/models/Rooms';
import { RoomsService } from 'src/app/services/rooms.service';
import { MatDialog } from '@angular/material/dialog';
import { RoomsDetailComponent } from '../roomsdetail/roomsdetail.component'
import { PatientRecordComponent } from '../patientrecord/patientrecord.component'
import { AdmitPatientComponent } from '../admitpatient/admitpatient.component'
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from "sweetalert2";
import { ServicerequestDetailComponent } from '../servicerequest-detail/servicerequest-detail.component';
import { PendingServiceRequestComponent } from '../pending-servicerequests/pending-servicerequests.component';

@Component({
  selector: 'app-roomslist',
  templateUrl: './roomslist.component.html',
  styleUrls: ['./roomslist.component.scss']
})
export class RoomsListComponent {

  rooms = [];
  paginatedRooms: any = [];
  index: number = 1;
  limit: number = 10;
  roomOptions = ['Active', "Don't Disturb", 'Discharge', 'Admit Patient']
  roomType = ['Patient', 'Admin', 'ICU', 'Surgery', 'Waiting']
  page = 0;
  size = 10;

  constructor(private http: HttpClient, private roomsService: RoomsService, private dialog: MatDialog, private snakbar: MatSnackBar) { }

  ngOnInit() {
    this.loadData();
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

  onDelete(room: Rooms) {

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.roomsService.delete(room.id).subscribe(params => {

          this.snakbar.open('Room has been deleted successfully.', 'Dismise', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });

          this.loadData();
          this.getData({ pageIndex: this.page, pageSize: this.size });

        });
      }
      else {
        Swal.fire(
          'Cancelled',
          'Your Room is safe :)',
          'error'
        )
      }
    })
  }
  onRoomOptionChange(value) {

  }
  searchRoom(searchText): any {
    if (searchText) {
      this.rooms = this.paginatedRooms.filter(room => room.roomNo.toLowerCase().includes(searchText.toLowerCase()));
    } else {
      this.rooms = this.paginatedRooms;
    }
  }

  onRoomTypeChange(value) {
    if (value) {
      this.rooms = this.paginatedRooms.filter(room => room.roomType.toLowerCase().includes(value.toLowerCase()));
    } else {
      this.rooms = this.paginatedRooms;
    }
  }
  onAdd() {

    console.log("onAdd() ........... trigger");

    const dialogRef = this.dialog.open(RoomsDetailComponent, {
      width: '750px',
      data: { id: 0 }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.loadData();
      this.getData({ pageIndex: this.page, pageSize: this.size });

    });
  }

  onEdit(data: any) {
    const dialogRef = this.dialog.open(RoomsDetailComponent, {
      width: '1050px',
      data: { id: data.id, room: data }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.loadData();
      this.getData({ pageIndex: this.page, pageSize: this.size });
    });
  }
  checkPatientRecord(room: Rooms) {
    console.log(room)
    const dialogRef = this.dialog.open(PatientRecordComponent, {
      width: '750px',
      data: { room: room }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  showServiceRequests(room) {
    const dialogRef = this.dialog.open(PendingServiceRequestComponent, {
      width: '650px',
      data: { room: room }
    });
    dialogRef.afterClosed().subscribe(result => {
    
      this.loadData();
    });
  }
  addServiceRequests() {

    const dialogRef = this.dialog.open(ServicerequestDetailComponent, {
      width: '650px',
      data: { id: 0 }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('done',result)
      // if(result){
      //   this.loadData();
      //   this.getData({ pageIndex: this.page, pageSize: this.size });
      //   this.snakbar.open('Service Request created successfully.', 'Dismise', {
      //     duration: 3000,
      //     horizontalPosition: 'right',
      //     verticalPosition: 'top',
      //   });
      // }
    });

  }


  onAdmitPatient(room:Rooms) {
    console.log(room)
    const dialogRef = this.dialog.open(AdmitPatientComponent, {
      width: '750px',
      data: { room: room }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
