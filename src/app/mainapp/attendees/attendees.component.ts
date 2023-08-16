import { Component, OnInit,AfterViewInit, ViewChild,Inject, TemplateRef, Input } from '@angular/core';
import { CdkDragDrop,CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DateTime } from 'luxon';
import { eventParticipantService } from 'src/app/services/eventParticipant.service';
import { EventParticipants } from 'src/app/models/EventParticipants';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import {ClipboardModule} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-attendees',
  templateUrl: './attendees.component.html',
  styleUrls: ['./attendees.component.scss']
})
export class AttendeesComponent implements OnInit {
  
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('checkedpaginator') checkedpaginator: MatPaginator;

  eventId:number
  attendeeData:any=[];
  allUsersData:any=[];
  sortAsc:boolean=false
  sortDesc:boolean=false
  sortAscNonAttendee:boolean=false
  sortDescNonAttendee:boolean=false
  
  displayedColumnsAttendee = ['select', 'username','invitationSent','invitationLink','isAttented'];
  displayedColumnsUser = ['select', 'username','email'];
  // sortOrder=[
  //   {value:'Position',key:0,},
  //   {value:'NameAsc',key:1},
  //   {value:'NameDsc',key:2},
  //   {value:'UserNameAsc',key:3},
  //   {value:'UserNameDsc',key:4},
  //   {value:'EmailAsc',key:5},
  //   {value:'EmailDsc',key:6}
  //   ]
  sendInvitation:boolean=false
  sortBy:string=''
  sortByNonAttendee:string=''
  applyOnAllSeries:boolean=true
  
  constructor(private eventParticipantService:eventParticipantService, private snakbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public request: any) {
      console.log("attendee request");
      console.log(request);
      if (request) {
        this.eventId = request.id;
      }
    }
  ngOnInit() {
    this.loadAttendee(0,'')
    this.loadNonAttendee(0,'')
    this.dataSource = new MatTableDataSource(this.data);
    this.nonAttendeeDataSource = new MatTableDataSource(this.checkedData);

    this.dataSource.paginator = this.paginator;
    this.nonAttendeeDataSource.paginator = this.checkedpaginator;
  }

  loadAttendee(sort,search) {
    if(this.eventId) {
      this.eventParticipantService.loadParticipants(this.eventId,sort,search).subscribe(results => {
        console.log("load attendee",results,this.eventId)

        this.data.splice(0,this.data.length)
        
        results.forEach(element => {
          this.attendeeData.push(element)
          });
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
          
      });
    }
  }

  loadNonAttendee(sort,search) {
    if(this.eventId) {
      this.eventParticipantService.loadNonParticipants(this.eventId,sort,search).subscribe(results => {
        console.log("load non attendee",results,this.eventId)
        
        this.checkedData.splice(0,this.checkedData.length)

        results.forEach(element => {
          this.allUsersData.push(element)
        });
    
        this.nonAttendeeDataSource = new MatTableDataSource(this.checkedData);
        this.nonAttendeeDataSource.paginator = this.checkedpaginator;

      }); 
    }
  }
  
  data = Object.assign(this.attendeeData);
  checkedData = Object.assign(this.allUsersData);

  dataSource = new MatTableDataSource(this.data);
  nonAttendeeDataSource = new MatTableDataSource(this.checkedData); 
  
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
    
    console.log("on romove attendee",prevData)

    this.removeParticipant(prevData)
  }

  removeParticipant(prevData){
    var observer: Observable<any>;
    if (prevData.eventId != null || prevData.eventId > 0){
      observer = this.eventParticipantService.removeParticipants(prevData,this.applyOnAllSeries);
    }
    observer.subscribe(result => {
      console.log("response of remove participant",result); 
      if(result){

        this.nonAttendeeDataSource.data.push(prevData.user);
        this.nonAttendeeDataSource.data = [...this.nonAttendeeDataSource.data];

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

  dropAttendee(event: any) {
    var prevData=event.previousContainer.data[event.previousIndex]
    console.log("on add to attendee",prevData)

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


    this.postParticipant(prevData)
  
    this.dataSource.paginator = this.paginator;
    this.nonAttendeeDataSource.paginator = this.checkedpaginator;

    
    // this.dataSource.data = JSON.parse(JSON.stringify(this.dataSource.data));
    // this.nonAttendeeDataSource.data = JSON.parse(JSON.stringify(this.nonAttendeeDataSource.data));
    
  }

  postParticipant(prevData){
    var eventParticipant: EventParticipants = {
      eventId: this.eventId,
      userId: prevData.id,
      username: prevData.username,
      invitationSent: 0,
      invitationLink:'',
      invitedDate:DateTime.utc().toISO(),
      isAttented:false,
    }
    var observer: Observable<any>;
    if (eventParticipant.eventId != null || eventParticipant.eventId > 0){
      console.log(this.applyOnAllSeries)
      observer = this.eventParticipantService.addParticipants(eventParticipant,this.applyOnAllSeries);
    }
    observer.subscribe(result => {
      console.log("response of add participant",result); 
      if(result) {
        this.dataSource.data.push(result);
        this.dataSource.data = [...this.dataSource.data];

        var index= this.nonAttendeeDataSource.data.indexOf(prevData)
        
        this.nonAttendeeDataSource.data.splice(index,1)
        this.nonAttendeeDataSource.data = [...this.nonAttendeeDataSource.data];

        this.checkedSelection = new SelectionModel(true, []);
        
        this.snakbar.open('Participant added successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
    });
  }

  isAllSelected() {
    
    const numSelected = this.selection.selected.length;
  
    numSelected?this.sendInvitation=true:this.sendInvitation=false
    // const numRows = this.dataSource.data.length;
    const page = this.dataSource.paginator.pageSize;
    return numSelected === page;

  }
  isAllCheckedSelected() {
    const numSelected = this.checkedSelection.selected.length;
    const numRows = this.nonAttendeeDataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
    this.selection.clear() :
    this.selectRows();
      console.log(this.selection.selected[0])
      
      this.selection.selected.length==0 ? this.sendInvitation=false : this.sendInvitation=true
    console.log("checked attendee",this.selection.selected);
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
    console.log("checked non attendee",this.checkedSelection.selected);
  }
  checkSelectRows() {
    for (let index = 0; index < this.nonAttendeeDataSource.paginator.pageSize; index++) {
      this.checkedSelection.select(this.nonAttendeeDataSource.data[index]);
      
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
        this.postParticipant(item)   
    });
    
  }

  sortUser(value){
    console.log("user sort",value)

    value==0?this.sortDescNonAttendee=false:this.sortDescNonAttendee=true
    value==0?this.sortAscNonAttendee=false:this.sortAscNonAttendee=false
    if(value == 0){
      this.sortByNonAttendee="Position"
    }
    if(value == 1){
      this.sortByNonAttendee="Name"
    }
    if(value == 3){
      this.sortByNonAttendee="UserName"
    }
    if(value == 5){
      this.sortByNonAttendee="Email"
    }
    this.loadNonAttendee(value,'')
  }

  sortAttendee(value){
    console.log("attendee sort",value)
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
    this.loadAttendee(value,'')    
  }

  filterFromAttendees(event){

    console.log(event.target.value)
    var search =event.target.value
    this.loadAttendee(0,search)
  }
  filterFromNonAttendees(event){

    console.log(event.target.value)
    var search =event.target.value
    this.loadNonAttendee(0,search)
    
  }

  sortDescAttendee(value){
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

    this.loadAttendee(sortOrder,'')
  }
  sortAscAttendee(value){
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
    this.loadAttendee(sortOrder,'')
    
  }
  sortDescNonAttendees(value){
    this.sortAscNonAttendee=true
    this.sortDescNonAttendee=false
    
    var sortOrder=0

    if(value == "Name"){
      this.sortByNonAttendee="Name"
      sortOrder =2
    }
    if(value == "UserName"){
      this.sortByNonAttendee="UserName"
      sortOrder=4
    }
    if(value == "Email"){
      this.sortByNonAttendee="Email"
      sortOrder=6
    }

    this.loadNonAttendee(sortOrder,'')
  }
  sortAscNonAttendees(value){
    this.sortAscNonAttendee=false
    this.sortDescNonAttendee=true
    var sortOrder=0

    if(value == "Name"){
      this.sortByNonAttendee="Name"
      sortOrder =1
    }
    if(value == "UserName"){
      this.sortByNonAttendee="UserName"
      sortOrder=3
    }
    if(value == "Email"){
      this.sortByNonAttendee="Email"
      sortOrder=5
    }
    this.loadNonAttendee(sortOrder,'')
    
  }
  applyOnRecursive(event) {
    this.applyOnAllSeries = event.checked
  }
  checkAttended(element,isAttented){ 
    this.updateAttendee(element,isAttented)  
  }
  updateAttendee(element,isAttented){
    var eventParticipant: EventParticipants = element
    eventParticipant.isAttented=isAttented
      console.log(eventParticipant)
    var observer: Observable<any>;
    if (eventParticipant.eventId != null || eventParticipant.eventId > 0){
      observer = this.eventParticipantService.updateParticipants(eventParticipant);
    }
    observer.subscribe(result => {
      console.log("response of update participant",result); 
      if(result){
        // this.dataSource.data.push(result);
        // this.dataSource.data = [...this.dataSource.data];

        // var index= this.nonAttendeeDataSource.data.indexOf(prevData)
        
        // this.nonAttendeeDataSource.data.splice(index,1)
        // this.nonAttendeeDataSource.data = [...this.nonAttendeeDataSource.data];

        // this.checkedSelection = new SelectionModel(true, []);
        
        this.snakbar.open('Participant Updated successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
    });
  }

  copyLink(link){
    console.log(link)
    // Document.execCommand("copy")
  }
}
