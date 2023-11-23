import { Component, OnInit, ViewChild } from '@angular/core';
//import { MatPaginator, MatTableDataSource, MatSortable, MatSortHeader, MatSort, MatFormFieldControl, MatInputModule,MatDatepickerInputEvent, MatSlideToggleChange } from "@angular/material";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Rooms } from 'src/app/models/Rooms';
import { nursingStationService } from 'src/app/services/nursingStation.service';
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
import { NursingStationDetailComponent } from 'src/app/mainapp/nursestationdetail/nursestationdetail.component';
import { NursingStation } from 'src/app/models/NursingStation';
import { Subscription, timer } from 'rxjs';

import { switchMap } from 'rxjs/operators';
import { AssignRoomToStationDetailComponent } from 'src/app/mainapp/assignroomtostation/assignroomtostation.component';
@Component({
  selector: 'app-nursestationlist',
  templateUrl: './nursestationlist.component.html',
  styleUrls: ['./nursestationlist.component.scss']
})
export class NurseStationListComponent {

  nursingstations = [];
  paginatedStations: any = [];
  roomOptions = ['Active', "Don't Disturb", 'Discharge', 'Admit Patient']
  roomType = ['Patient', 'Admin', 'ICU', 'Surgery', 'Waiting']
  index: number = 1;
  limit: number = 10;
  page = 0;
  size = 10;

  constructor(private http: HttpClient, private nursingStationService: nursingStationService, private dialog: MatDialog, private snakbar: MatSnackBar) { }

  ngOnInit() {
    this.loadData()
  }
  ngAfterViewInit(){
    setInterval( ()=>{
      this.loadData()
    console.log('interval works')
    }, 5000)
  
}

  loadData() {
    this.nursingStationService.loadData(this.index, this.limit).subscribe(results => {
      this.paginatedStations = results
      this.getData({ pageIndex: this.page, pageSize: this.size });
    });
  }

  getData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;

    this.nursingstations = this.paginatedStations.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
  }

  onDelete(nursingStation: NursingStation) {

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

        this.nursingStationService.delete(nursingStation.id).subscribe(params => {

          this.snakbar.open('Nursing Station has been deleted successfully.', 'Dismise', {
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
          'Your Nursing Station is safe :)',
          'error'
        )
      }
    })
  }

  searchRoom(searchText): any {
    if (searchText) {
      this.nursingstations = this.paginatedStations.filter(room => room.roomNo.toLowerCase().includes(searchText.toLowerCase()));
    } else {
      this.nursingstations = this.paginatedStations;
    }
  }

  onRoomTypeChange(value) {
    if (value) {
      this.nursingstations = this.paginatedStations.filter(room => room.roomType.toLowerCase().includes(value.toLowerCase()));
    } else {
      this.nursingstations = this.paginatedStations;
    }
  }
  onAdd() {

    console.log("onAdd() ........... trigger");

    const dialogRef = this.dialog.open(NursingStationDetailComponent, {
      width: '750px',
      data: { id: 0 }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.loadData();
      this.getData({ pageIndex: this.page, pageSize: this.size });

    });
  }

  onEdit(nursingStation:NursingStation) {
    const dialogRef = this.dialog.open(NursingStationDetailComponent, {
      width: '750px',
      data: { nursingStation: nursingStation }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.loadData();
      this.getData({ pageIndex: this.page, pageSize: this.size });
    });
  }
  onAssignRooms(nursingStation:NursingStation) {

    const dialogRef = this.dialog.open(AssignRoomToStationDetailComponent, {
      width: '650px',
      data: { nursingStation: nursingStation }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
}
