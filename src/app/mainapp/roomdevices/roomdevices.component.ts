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
  selector: 'app-roomdevices',
  templateUrl: './roomdevices.component.html',
  styleUrls: ['./roomdevices.component.scss']
})
export class RoomDevicesComponent implements OnInit {
  
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('checkedpaginator') checkedpaginator: MatPaginator;

  roomId:number
  devicesData:any=[];
  notInstalledDevicesData:any=[];
  sortAsc:boolean=false
  sortDesc:boolean=false
  sortAscNonDevices:boolean=false
  sortDescNonDevices:boolean=false
  
  displayedColumnsDevices = ['select', 'installedDevices'];
  displayedColumnsNonDevices = ['select', 'notInstalledDevices'];
  sendInvitation:boolean=false
  sortBy:string=''
  sortByNonDevices:string=''
  
  constructor(private roomDevicesService:roomDevicesService, private snakbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public request: any) {
      console.log("devices request");
      console.log(request);
      if (request) {
        this.roomId = request.room.id;
      }
    }
  ngOnInit() {
    // console.log(1)
    this.loadDevices(0,'')
    this.loadNonDevices(0,'')
    this.dataSource = new MatTableDataSource(this.data);
    this.nonDevicesDataSource = new MatTableDataSource(this.checkedData);

    this.dataSource.paginator = this.paginator;
    this.nonDevicesDataSource.paginator = this.checkedpaginator;
  }

  loadDevices(sort,search) {
    if(this.roomId) { 
      this.roomDevicesService.loadInstalledDevices(this.roomId,sort,search).subscribe(results => {
        console.log("load Devices",results,this.roomId)

        this.data.splice(0,this.data.length)
        
        results.forEach(element => {
          this.devicesData.push(element)
          });
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
          
      });
    }
  }

  loadNonDevices(sort,search) {
    if(this.roomId) {
      this.roomDevicesService.loadNotInstalledDevices(this.roomId,sort,search).subscribe(results => {
        console.log("load non Devices",results,this.roomId)
        
        this.checkedData.splice(0,this.checkedData.length)

        results.forEach(element => {
          this.notInstalledDevicesData.push(element)
        });
    
        this.nonDevicesDataSource = new MatTableDataSource(this.checkedData);
        this.nonDevicesDataSource.paginator = this.checkedpaginator;

      }); 
    }
  }
  
  data = Object.assign(this.devicesData);
  checkedData = Object.assign(this.notInstalledDevicesData);

  dataSource = new MatTableDataSource(this.data);
  nonDevicesDataSource = new MatTableDataSource(this.checkedData); 
  
  selection = new SelectionModel(true, []);
  checkedSelection = new SelectionModel(true, []);
 
  uncheckedData = this.data;

  drop(event:any){

    var prevData=event.previousContainer.data[event.previousIndex]

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // transferArrayItem(
      //   event.previousContainer.data,
      //   event.container.data,
      //   event.previousIndex,
      //   event.currentIndex
      // );
    }
    
    console.log("on romove device",prevData)

    this.removeParticipant(prevData)
  }

  removeParticipant(prevData){
    console.log("remove pre",prevData)
    var observer: Observable<any>;
    if (this.roomId != null || this.roomId > 0){
      observer = this.roomDevicesService.removeDevics(this.roomId,prevData);
    }
    observer.subscribe(result => {
      console.log("response of remove participant",result); 
      if(result){

        this.nonDevicesDataSource.data.push(prevData);
        this.nonDevicesDataSource.data = [...this.nonDevicesDataSource.data];

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

  dropDevices(event: any) {
    var prevData=event.previousContainer.data[event.previousIndex]
    console.log("on add to Devices",prevData)

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // transferArrayItem(
      //   event.previousContainer.data,
      //   event.container.data,
      //   event.previousIndex,
      //   event.currentIndex
      // );
    }


    this.postDevice(prevData)
  
    this.dataSource.paginator = this.paginator;
    this.nonDevicesDataSource.paginator = this.checkedpaginator;

    
    // this.dataSource.data = JSON.parse(JSON.stringify(this.dataSource.data));
    // this.nonDevicesDataSource.data = JSON.parse(JSON.stringify(this.nonDevicesDataSource.data));
    
  }

  postDevice(prevData){
    console.log("pre",prevData)
    var roomDevice = {
      roomId: this.roomId,
      deviceId: prevData.id,
      deviceIP: "string",
      serviceUrl: "string"
    }
    var observer: Observable<any>;
    if (roomDevice.roomId != null || roomDevice.roomId > 0){
      
      observer = this.roomDevicesService.addDevice(roomDevice);
    }
    observer.subscribe(result => {
      console.log("response of add participant",result); 
      if(result) {
        this.dataSource.data.push(result);
        this.dataSource.data = [...this.dataSource.data];

        var index= this.nonDevicesDataSource.data.indexOf(prevData)
        
        this.nonDevicesDataSource.data.splice(index,1)
        this.nonDevicesDataSource.data = [...this.nonDevicesDataSource.data];

        this.checkedSelection = new SelectionModel(true, []);
        
        this.snakbar.open('Device added successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
    });
  }

  isAllSelected() {
    
    const numSelected = this.selection.selected.length;
  
    // numSelected?this.sendInvitation=true:this.sendInvitation=false
    // const numRows = this.dataSource.data.length;
    const page = this.dataSource.paginator.pageSize;
    return numSelected === page;

  }
  isAllCheckedSelected() {
    const numSelected = this.checkedSelection.selected.length;
    const numRows = this.nonDevicesDataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
    this.selection.clear() :
    this.selectRows();
      console.log(this.selection.selected[0])
      
      // this.selection.selected.length==0 ? this.sendInvitation=false : this.sendInvitation=true
    console.log("checked Devices",this.selection.selected);
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
    console.log("checked non Devices",this.checkedSelection.selected);
  }
  checkSelectRows() {
    for (let index = 0; index < this.nonDevicesDataSource.paginator.pageSize; index++) {
      this.checkedSelection.select(this.nonDevicesDataSource.data[index]);
      
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
        this.postDevice(item)   
    });
    
  }

  sortUser(value){
    console.log("user sort",value)

    value==0?this.sortDescNonDevices=false:this.sortDescNonDevices=true
    value==0?this.sortAscNonDevices=false:this.sortAscNonDevices=false
    if(value == 0){
      this.sortByNonDevices="Position"
    }
    if(value == 1){
      this.sortByNonDevices="Name"
    }
    if(value == 3){
      this.sortByNonDevices="UserName"
    }
    if(value == 5){
      this.sortByNonDevices="Email"
    }
    this.loadNonDevices(value,'')
  }

  sortDevices(value){
    console.log("Devices sort",value)
    value==0?this.sortDesc=false:this.sortDesc=true
    value==0?this.sortAsc=false:this.sortAsc=false
    if(value == 0){
      this.sortBy="Position"
    }
    if(value == 1){
      this.sortBy="Name"
    }
    if(value == 3){
      this.sortBy="UserName"
    }
    if(value == 5){
      this.sortBy="Email"
    }
    this.loadDevices(value,'')    
  }

  filterFromDevices(event){

    console.log(event.target.value)
    var search =event.target.value
    this.loadDevices(0,search)
  }
  filterFromNonDevices(event){

    console.log(event.target.value)
    var search =event.target.value
    this.loadNonDevices(0,search)
    
  }

  sortDescDevices(value){
    this.sortAsc=true
    this.sortDesc=false
    
    var sortOrder=0

    if(value == "Name"){
      this.sortBy="Name"
      sortOrder =2
    }
    if(value == "UserName"){
      this.sortBy="UserName"
      sortOrder=4
    }
    if(value == "Email"){
      this.sortBy="Email"
      sortOrder=6
    }

    this.loadDevices(sortOrder,'')
  }
  sortAscDevices(value){
    this.sortAsc=false
    this.sortDesc=true
    var sortOrder=0

    if(value == "Name"){
      this.sortBy="Name"
      sortOrder =1
    }
    if(value == "UserName"){
      this.sortBy="UserName"
      sortOrder=3
    }
    if(value == "Email"){
      this.sortBy="Email"
      sortOrder=5
    }
    this.loadDevices(sortOrder,'')
    
  }
  sortDescNonDevicess(value){
    this.sortAscNonDevices=true
    this.sortDescNonDevices=false
    
    var sortOrder=0

    if(value == "Name"){
      this.sortByNonDevices="Name"
      sortOrder =2
    }
    if(value == "UserName"){
      this.sortByNonDevices="UserName"
      sortOrder=4
    }
    if(value == "Email"){
      this.sortByNonDevices="Email"
      sortOrder=6
    }

    this.loadNonDevices(sortOrder,'')
  }
  sortAscNonDevicess(value){
    this.sortAscNonDevices=false
    this.sortDescNonDevices=true
    var sortOrder=0

    if(value == "Name"){
      this.sortByNonDevices="Name"
      sortOrder =1
    }
    if(value == "UserName"){
      this.sortByNonDevices="UserName"
      sortOrder=3
    }
    if(value == "Email"){
      this.sortByNonDevices="Email"
      sortOrder=5
    }
    this.loadNonDevices(sortOrder,'')
    
  }
  
 
}
