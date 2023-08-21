import { Component, OnInit, ViewChild } from '@angular/core';
//import { MatPaginator, MatTableDataSource, MatSortable, MatSortHeader, MatSort, MatFormFieldControl, MatInputModule,MatDatepickerInputEvent, MatSlideToggleChange } from "@angular/material";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, timer, interval, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

import { Rooms } from 'src/app/models/Rooms';
import { RoomsService } from 'src/app/services/rooms.service';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { RoomsDetailComponent } from '../roomsdetail/roomsdetail.component'
import { PatientRecordComponent } from '../patientrecord/patientrecord.component'
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from "sweetalert2";

@Component({
  selector: 'app-roomslist',
  templateUrl: './roomslist.component.html',
  styleUrls: ['./roomslist.component.scss']
})
export class RoomsListComponent {

  subscription: Subscription;
  displayedColumns: string[] = ['select',
    'roomId',
    'roomType',
    'floor',
    'branch',
    'IP',
    'status',
    'id'
  ];

  rooms = [];
  paginatedRooms:any = [];
  index: number = 1;
  limit: number = 10;
  roomOptions=['Active',"Don't Disturb",'Discharge','Admit Patient']
  roomType=['Patient','Admin','ICU','Surgery','Waiting']
  page = 0;
  size = 10;

  constructor(private http: HttpClient, private roomsService: RoomsService, private dialog: MatDialog, private snakbar: MatSnackBar) { }

  ngOnInit() {
    this.loadData(); 
  }
  
  loadData(){
    this.roomsService.loadData(this.index, this.limit).subscribe(results => {
      this.paginatedRooms=results
      this.getData({pageIndex: this.page, pageSize: this.size});
      // results.forEach(element => {
      //   this.paginatedRooms.push(element)
      // });
    });
  }

  getData(obj) {
    let index=0,
    startingIndex=obj.pageIndex * obj.pageSize,
    endingIndex=startingIndex + obj.pageSize;

    this.rooms = this.paginatedRooms.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
  }

  ondelete(room: any) {

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
  onRoomOptionChange(value){

  } 
  searchRoom(searchText):any{ 
    if (searchText) {
      this.rooms = this.paginatedRooms.filter(room => room.roomId.toLowerCase().includes(searchText.toLowerCase()));
    } else {
      this.rooms= this.paginatedRooms;
    }
  }

  onRoomTypeChange(value){
    if (value) {
      this.rooms = this.paginatedRooms.filter(room => room.roomType.toLowerCase().includes(value.toLowerCase()));
    } else {
      this.rooms = this.paginatedRooms;
    }
  }
  onAdd() {

    console.log("onAdd() ........... trigger");

    const dialogRef = this.dialog.open(RoomsDetailComponent, {
      width: '650px',
      data: { id: 0 }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadData();
    });
  }
  
  onEdit(data: any) {
    const dialogRef = this.dialog.open(RoomsDetailComponent, {
      width: '650px',
      data: { id: data.id, room: data }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadData();
    });
  }
  checkPatientRecord(room:Rooms) {
    console.log(room)


    const dialogRef = this.dialog.open(PatientRecordComponent, {
      width: '750px',
      data: { room: room }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  
}
