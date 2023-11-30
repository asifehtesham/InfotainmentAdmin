import { Component, OnInit, ViewChild } from '@angular/core';
//import { MatPaginator, MatTableDataSource, MatSortable, MatSortHeader, MatSort, MatFormFieldControl, MatInputModule,MatDatepickerInputEvent, MatSlideToggleChange } from "@angular/material";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Rooms } from 'src/app/models/Rooms';
import { RoomsService } from 'src/app/services/rooms.service';
import { MatDialog } from '@angular/material/dialog';
import { RoomsDetailComponent } from '../roomsdetail/roomsdetail.component'
import { PatientRecordComponent } from '../patientrecord/patientrecord.component'
import { AdmitPatientComponent } from '../admitpatient/admitpatient.component';
import { AddRoomDeviceComponent } from '../addroomdevice/addroomdevice.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from "sweetalert2";
import { ServicerequestDetailComponent } from '../servicerequest-detail/servicerequest-detail.component';
import { PendingServiceRequestComponent } from '../pending-servicerequests/pending-servicerequests.component';
import { PatientComplaintComponent } from '../patient-complaint/patient-complaint.component';
import { RoomTypeService } from 'src/app/services/roomType.service';

@Component({
  selector: 'app-roomslist',
  templateUrl: './roomslist.component.html',
  styleUrls: ['./roomslist.component.scss']
})
export class RoomsListComponent {

  rooms = [];
  paginatedRooms: any = [];
  roomOptions = ['Active', "Don't Disturb", 'Discharge', 'Admit Patient']
  roomType = []
  index: number = 1;
  limit: number = 10;
  page = 0;
  size = 10;

  constructor(private http: HttpClient, private roomTypeService: RoomTypeService, private roomsService: RoomsService, private dialog: MatDialog, private snakbar: MatSnackBar) { }

  ngOnInit() {
    this.loadData();
    this.roomTypeService.loadData().subscribe(results => {
      results.forEach(element => {
        this.roomType.push(element);
      }); 
    })
  }
  // ngAfterViewInit(){
  //   setInterval( ()=>{
  //     this.loadData()
  //   console.log('interval works')
  //   }, 5000)
  // }

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
    console.log(this.rooms)
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
      this.rooms = this.paginatedRooms.filter(room => room.roomTypeDetails.title.toLowerCase().includes(value.toLowerCase()));
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
      width: '750px',
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

  disChargePatient(room) {
    console.log("discharge", room)
    this.roomsService.checkOutPatient(room)
    this.loadData();
    this.getData({ pageIndex: this.page, pageSize: this.size });

  }

  doNotDisturb(room) {
    console.log("do not disturb", room)    
    this.roomsService.doNotDisturb(room)
    
    this.loadData();
    this.getData({ pageIndex: this.page, pageSize: this.size });

  }

  onAdmitPatient(room: Rooms) {
    console.log(room)
    const dialogRef = this.dialog.open(AdmitPatientComponent, {
      width: '750px',
      data: { room: room }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("1",result)
      
    });
  }
  onAddDevices(room: Rooms) {
    const dialogRef = this.dialog.open(AddRoomDeviceComponent, {
      width: '1050px',
      data: { room: room }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  onViewComplaints(room: Rooms) {
    const dialogRef = this.dialog.open(PatientComplaintComponent, {
      width: '650px',
      data: { room: room }
    });
    dialogRef.afterClosed().subscribe(result => {

      // this.loadData();
    });
  }
}
