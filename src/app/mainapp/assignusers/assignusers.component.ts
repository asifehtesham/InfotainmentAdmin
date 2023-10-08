import { Component, OnInit,AfterViewInit, ViewChild,Inject, TemplateRef, Input } from '@angular/core';
import { CdkDragDrop,CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DateTime } from 'luxon';
import { roomDevicesService } from 'src/app/services/roomDevices.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import {ClipboardModule} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-assignusers',
  templateUrl: './assignusers.component.html',
  styleUrls: ['./assignusers.component.scss']
})
export class AssignUsersCohortComponent implements OnInit {
  
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('checkedpaginator') checkedpaginator: MatPaginator;

  cohortId:number
  currentUsersData:any=[];
  potentialUsersData:any=[];
  sortAsc:boolean=false
  sortDesc:boolean=false
  sortAscPotentialUsers:boolean=false
  sortDescPotentialUsers:boolean=false
  
  displayedColumnsUsers = ['select', 'currentUsers'];
  displayedColumnsNonUsers = ['select', 'potentialUsers'];
  sendInvitation:boolean=false
  sortBy:string=''
  sortByPotentialUsers:string=''
  
  constructor(private roomDevicesService:roomDevicesService, private snakbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public request: any) {
      console.log("users request");
      console.log(request);
      if (request) {
        this.cohortId = request.id;
      }
    }
  ngOnInit() {
    this.loadCurrentUsers(0,'')
    this.loadPotentialUsers(0,'')
    this.dataSource = new MatTableDataSource(this.data);
    this.nonUsersDataSource = new MatTableDataSource(this.checkedData);

    this.dataSource.paginator = this.paginator;
    this.nonUsersDataSource.paginator = this.checkedpaginator;
  }

  data = Object.assign(this.currentUsersData);
  checkedData = Object.assign(this.potentialUsersData);

  dataSource = new MatTableDataSource(this.data);
  nonUsersDataSource = new MatTableDataSource(this.checkedData); 
  
  selection = new SelectionModel(true, []);
  checkedSelection = new SelectionModel(true, []);
 
  uncheckedData = this.data;

  loadCurrentUsers(sort,search) {
    if(this.cohortId) { 
      this.roomDevicesService.loadInstalledDevices(this.cohortId,sort,search).subscribe(results => {
        console.log("load users",results,this.cohortId)

        this.data.splice(0,this.data.length)
        
        results.forEach(element => {
          this.currentUsersData.push(element)
          });
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
          
      });
    }
  }

  loadPotentialUsers(sort,search) {
    if(this.cohortId) {
      this.roomDevicesService.loadNotInstalledDevices(this.cohortId,sort,search).subscribe(results => {
        console.log("load potential users",results,this.cohortId)
        
        this.checkedData.splice(0,this.checkedData.length)

        results.forEach(element => {
          this.potentialUsersData.push(element)
        });
    
        this.nonUsersDataSource = new MatTableDataSource(this.checkedData);
        this.nonUsersDataSource.paginator = this.checkedpaginator;

      }); 
    }
  }
  drop(event:any){

    var prevData=event.previousContainer.data[event.previousIndex]

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    console.log("on romove user",prevData)
    this.removeParticipant(prevData)
  }
  removeParticipant(prevData){
    console.log("remove pre",prevData)
    var observer: Observable<any>;
    if (this.cohortId != null || this.cohortId > 0){
      observer = this.roomDevicesService.removeDevics(this.cohortId,prevData);
    }
    observer.subscribe(result => {
      console.log("response of remove participant",result); 
      if(result){

        this.nonUsersDataSource.data.push(prevData);
        this.nonUsersDataSource.data = [...this.nonUsersDataSource.data];

        var index= this.dataSource.data.indexOf(prevData)
        
        this.dataSource.data.splice(index,1)
        this.dataSource.data = [...this.dataSource.data];
        
        this.selection = new SelectionModel(true, []);
      
        this.snakbar.open('Participant removed successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
    });
  }
  dropUsers(event: any) {
    var prevData=event.previousContainer.data[event.previousIndex]
    console.log("on add to current user",prevData)

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }

    this.postCurrentUser(prevData)  
    this.dataSource.paginator = this.paginator;
    this.nonUsersDataSource.paginator = this.checkedpaginator;
  }
  postCurrentUser(prevData){
    console.log("pre",prevData)
    var roomDevice = {
      cohortId: this.cohortId,
      deviceId: prevData.id,
    }
    var observer: Observable<any>;
    if (roomDevice.cohortId != null || roomDevice.cohortId > 0){
      
      observer = this.roomDevicesService.addDevice(roomDevice);
    }
    observer.subscribe(result => {
      console.log("response of add participant",result); 
      if(result) {
        this.dataSource.data.push(result);
        this.dataSource.data = [...this.dataSource.data];

        var index= this.nonUsersDataSource.data.indexOf(prevData)
        
        this.nonUsersDataSource.data.splice(index,1)
        this.nonUsersDataSource.data = [...this.nonUsersDataSource.data];

        this.checkedSelection = new SelectionModel(true, []);
        
        this.snakbar.open('User added successfully.', 'Dismise', {
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
    const numRows = this.nonUsersDataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
    this.selection.clear() :
    this.selectRows();
      console.log(this.selection.selected[0])
      
      // this.selection.selected.length==0 ? this.sendInvitation=false : this.sendInvitation=true
    console.log("checked Current Users",this.selection.selected);
  }
  selectRows() {
    for (let index = 0; index < this.dataSource.paginator.pageSize; index++) {
      this.selection.select(this.dataSource.data[index]);
    }
    // this.selection.selected.filter(item => !!item);
  }
  masterCheckedToggle() {
    this.isAllCheckedSelected() ?
    this.checkedSelection.clear() :
    this.checkSelectRows();
    console.log("checked potential users",this.checkedSelection.selected);
  }
  checkSelectRows() {
    for (let index = 0; index < this.nonUsersDataSource.paginator.pageSize; index++) {
      this.checkedSelection.select(this.nonUsersDataSource.data[index]);
      
    }
    // this.checkedSelection.selected.filter(item => !!item);
  }
  moveToSecondTable() {
    this.selection.selected.forEach(item => {
      this.removeParticipant(item)
    });
  }  
  moveToFirstTable() {
      this.checkedSelection.selected.forEach(item => {
        this.postCurrentUser(item)   
    });
    
  }

  sortUser(value){
    console.log("user sort",value)

    value==0?this.sortDescPotentialUsers=false:this.sortDescPotentialUsers=true
    value==0?this.sortAscPotentialUsers=false:this.sortAscPotentialUsers=false
    if(value == 0){
      this.sortByPotentialUsers="Position"
    }
    if(value == 1){
      this.sortByPotentialUsers="Name"
    }
    if(value == 3){
      this.sortByPotentialUsers="UserName"
    }
    if(value == 5){
      this.sortByPotentialUsers="Email"
    }
    this.loadPotentialUsers(value,'')
  }
  sortDescPotentialUserss(value){
    this.sortAscPotentialUsers=true
    this.sortDescPotentialUsers=false
    
    var sortOrder=0

    if(value == "Name"){
      this.sortByPotentialUsers="Name"
      sortOrder =2
    }
    if(value == "UserName"){
      this.sortByPotentialUsers="UserName"
      sortOrder=4
    }
    if(value == "Email"){
      this.sortByPotentialUsers="Email"
      sortOrder=6
    }

    this.loadPotentialUsers(sortOrder,'')
  }
  sortAscPotentialUserss(value){
    this.sortAscPotentialUsers=false
    this.sortDescPotentialUsers=true
    var sortOrder=0

    if(value == "Name"){
      this.sortByPotentialUsers="Name"
      sortOrder =1
    }
    if(value == "UserName"){
      this.sortByPotentialUsers="UserName"
      sortOrder=3
    }
    if(value == "Email"){
      this.sortByPotentialUsers="Email"
      sortOrder=5
    }
    this.loadPotentialUsers(sortOrder,'')
  }
}
