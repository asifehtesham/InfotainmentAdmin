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
    'id'];
  rooms = [];
  search = new FormControl();
  index: number = 1;
  limit: number = 10;
  pageTotal: number = 20;
  roomOptions=['Active',"Don't Disturb",'Discharge','Admit Patient']
  public loadEmptyMsg: boolean = false; 
  selection = new SelectionModel<Rooms>(true, []);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortable: MatSort;

  constructor(private http: HttpClient, private roomsService: RoomsService, private dialog: MatDialog, private snakbar: MatSnackBar) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.roomsService.loadData(this.index, this.limit).subscribe(results => {
      results.forEach(element => {
        this.rooms.push(element)
      });
    });
  }

  onRoomOptionChange(value){

  } 
 page(event) {
    this.index = event.pageIndex + 1;
    this.limit = event.pageSize;

    this.loadData();
  }
  chkActive_changed(ambulance: any, $event: MatSlideToggleChange) {

    console.log("chkActive_changed: " + ambulance.id);
    console.log($event.checked);

    ambulance.IsActive = $event.checked;
    this.roomsService.editactive(ambulance).subscribe();

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

          this.snakbar.open('Record has been deleted successfully.', 'Dismise', {
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
 
searchRoom(searchText):any{
console.log(searchText)
let filteredData
  if (searchText) {
    this.rooms= this.rooms.filter(room => room.roomId.toLowerCase().includes(searchText.toLowerCase()));
    console.log(filteredData)
  } else {
    return this.rooms;
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
