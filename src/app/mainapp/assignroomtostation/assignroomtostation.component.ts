import { Component, OnInit, AfterViewInit, ViewChild, Inject, TemplateRef, Input } from '@angular/core';
import { CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DateTime } from 'luxon';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { stationAssignedRoomsService } from 'src/app/services/stationAssignedRooms.service';

@Component({
  selector: 'app-assignroomtostation',
  templateUrl: './assignroomtostation.component.html',
  styleUrls: ['./assignroomtostation.component.scss']
})
export class AssignRoomToStationDetailComponent implements OnInit {

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('checkedpaginator') checkedpaginator: MatPaginator;

  stationId: number
  roomsData: any = [];
  notIncludedRoomsData: any = [];

  displayedColumnsRooms = ['select', 'IncludedRooms'];
  displayedColumnsNonRooms = ['select', 'notIncludedRooms'];

  constructor(private stationAssignedRoomService: stationAssignedRoomsService, private snakbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    console.log("request",request);
    if (request && request.nursingStation) {
      this.stationId = request.nursingStation.id
    }
  }
  ngOnInit() {
    this.loadRooms()
    this.loadNotIncludedRooms()

    this.dataSource = new MatTableDataSource(this.data);
    this.nonAssignedRoomsDataSource = new MatTableDataSource(this.checkedData);

    this.dataSource.paginator = this.paginator;
    this.nonAssignedRoomsDataSource.paginator = this.checkedpaginator;
  }

  loadRooms() {
    if (this.stationId) {
      this.stationAssignedRoomService.loadIncludedRooms(this.stationId).subscribe(results => {
        console.log("load included Room", results, this.stationId)

        this.data.splice(0, this.data.length)

        results.forEach(element => {
          this.roomsData.push(element)
        });
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;

      });
    }
  }

  loadNotIncludedRooms() {
    if (this.stationId) {
      this.stationAssignedRoomService.loadNotIncludedRooms(this.stationId).subscribe(results => {
        console.log("load non assigned Rooms", results, this.stationId)

        this.checkedData.splice(0, this.checkedData.length)

        results.forEach(element => {
          this.notIncludedRoomsData.push(element)
        });

        this.nonAssignedRoomsDataSource = new MatTableDataSource(this.checkedData);
        this.nonAssignedRoomsDataSource.paginator = this.checkedpaginator;

      });
    }
  }

  data = Object.assign(this.roomsData);
  checkedData = Object.assign(this.notIncludedRoomsData);

  dataSource = new MatTableDataSource(this.data);
  nonAssignedRoomsDataSource = new MatTableDataSource(this.checkedData);

  selection = new SelectionModel(true, []);
  checkedSelection = new SelectionModel(true, []);

  uncheckedData = this.data;

  drop(event: any) {

    var prevData = event.previousContainer.data[event.previousIndex]

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
    }

    console.log("on romove room", prevData)

    this.removeRoomFromStaion(prevData)
  }

  removeRoomFromStaion(prevData) {
    console.log("remove pre", prevData)
    var observer: Observable<any>;
    if (this.stationId != null || this.stationId > 0) {
      observer = this.stationAssignedRoomService.removeRooms(this.stationId, prevData);
    }
    observer.subscribe(result => {
      console.log("response of remove room", result);
      if (result) {

        this.nonAssignedRoomsDataSource.data.push(prevData);
        this.nonAssignedRoomsDataSource.data = [...this.nonAssignedRoomsDataSource.data];

        var index = this.dataSource.data.indexOf(prevData)

        this.dataSource.data.splice(index, 1)
        this.dataSource.data = [...this.dataSource.data];

        this.selection = new SelectionModel(true, []);

        this.snakbar.open('Room removed successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
    });
  }

  dropRoom(event: any) {
    var prevData = event.previousContainer.data[event.previousIndex]
    console.log("on add to Not included", prevData)

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
    }


    this.postRoomFromStation(prevData)

    this.dataSource.paginator = this.paginator;
    this.nonAssignedRoomsDataSource.paginator = this.checkedpaginator;
  }

  postRoomFromStation(prevData) {
    console.log("pre", prevData)
    var AddRoom = {
      stationId: this.stationId,
      roomNo: prevData.roomNo,
    }
    var observer: Observable<any>;
    if (AddRoom.stationId != null || AddRoom.stationId > 0) {

      observer = this.stationAssignedRoomService.addRoom(AddRoom);
    }
    observer.subscribe(result => {
      console.log("response of add room", result);
      if (result) {
        this.dataSource.data.push(result);
        this.dataSource.data = [...this.dataSource.data];

        var index = this.nonAssignedRoomsDataSource.data.indexOf(prevData)

        this.nonAssignedRoomsDataSource.data.splice(index, 1)
        this.nonAssignedRoomsDataSource.data = [...this.nonAssignedRoomsDataSource.data];

        this.checkedSelection = new SelectionModel(true, []);

        this.snakbar.open('Rooms added successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const page = this.dataSource.paginator.pageSize;
    return numSelected === page;

  }
  isAllCheckedSelected() {
    const numSelected = this.checkedSelection.selected.length;
    const numRows = this.nonAssignedRoomsDataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.selectRows();
    console.log(this.selection.selected[0])

    console.log("checked Rooms", this.selection.selected);
  }

  selectRows() {
    for (let index = 0; index < this.dataSource.paginator.pageSize; index++) {
      this.selection.select(this.dataSource.data[index]);
    }
  }
  masterCheckedToggle() {
    this.isAllCheckedSelected() ?
      this.checkedSelection.clear() :
      this.checkSelectRows();
    console.log("checked not Included", this.checkedSelection.selected);
  }
  checkSelectRows() {
    for (let index = 0; index < this.nonAssignedRoomsDataSource.paginator.pageSize; index++) {
      this.checkedSelection.select(this.nonAssignedRoomsDataSource.data[index]);
    }
  }
  moveToSecondTable() {
    this.selection.selected.forEach(item => {
      this.removeRoomFromStaion(item)
    });
  }
  moveToFirstTable() {
    this.checkedSelection.selected.forEach(item => {
      this.postRoomFromStation(item)
    });

  }
}
