import { Component, OnInit, ViewChild, ElementRef, Input, Inject, AfterViewInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { SingleFileUploadComponent } from 'src/app/coreui/single-file-upload/single-file-upload.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { MatTable, MatTableDataSource } from '@angular/material/table';
// import clonedeep from 'lodash.clonedeep';
import { CdkDropList} from '@angular/cdk/drag-drop';
import { COMMA, ENTER, P } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Events } from 'src/app/models/Events';
import { User } from 'src/app/models/Users';
import { RecurrenceEvent } from 'src/app/models/RecurrenceEvent';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from 'src/app/services/events.service';
import { UserService } from 'src/app/services/user.service';
import { DateTime } from 'luxon';
import { eventParticipantService } from 'src/app/services/eventParticipant.service';
import { EventParticipants } from 'src/app/models/EventParticipants';
import { AttendeesComponent } from 'src/app/mainapp/attendees/attendees.component';
import { EventEmitter } from 'node:events';

@Component({
  selector: 'app-calenderdetail',
  templateUrl: './calenderdetail.component.html',
  styleUrls: ['./calenderdetail.component.scss']
})
export class CalenderdetailComponent implements OnInit {

  id: number;
  events: Events;
  user: User;
  eventsForm: FormGroup;
  url: string = '';
  isEventsSaved: boolean = true;
  inputURLType: string = 'text';
  locationOrUrl:string = "Event Location";
  linkOrLocationIcon:string = "location_on"
  editorConfig: any = EditorConfig;
  isRepeat:number=0
  repeatType:string=""
  repeatEnd:string=""
  pattern:number 
  monthOfYears = [
    {name:'JANUARY',key:0},
    {name:'FEBRUARY',key:1},
    {name:'APRIL',key:2},
    {name:'MARCH',key:3},
    {name:'APRIL',key:4},
    {name:'JUNE',key:5},
    {name:'JULY',key:6},
    {name:'AUGUST',key:7},
    {name:'SEPTEMBER',key:8},
    {name:'OCTOBER',key:9},
    {name:'NOVEMBER',key:10},
    {name:'DECEMBER',key:11}
  ]
  eventColors =['Blue','Green','Orange','Red','Purple','Yellow']
  eventStatus = [{value:'Scheduled',key:1},{value:'InProgress',key:2},{value:'Postponed',key:3},{value:'Cancelled',key:4},{value:'Completed',key:5}]
  repeatPattern = ['Daily','Weekly','Monthly','Yearly']
  isDisabledOccurence:boolean =false  
  isDisabledEndDate: boolean = true;
  month:number
  day:number
  repeatOnWeekDays=[]
  repeatOn:number=0
  repeatOnMonth:number=0
  isRecursive:boolean=false
  showHideTime =true
  isPublicEvent:string="Public"
  constructor(private route: ActivatedRoute, private fb: FormBuilder,private eventParticipantService:eventParticipantService, private eventsService: EventsService, private userService:UserService, 
    private snakbar: MatSnackBar, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any) {
      console.log("request");
      console.log(request);
      if (request) {
        this.id = request.id;
        this.events = request.events;
      }
    }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log("eventsID para:" + this.id);
      this.buildForm();
      if (this.events != null)
        this.setForm();
        if (this.events == null && this.id > 0) {
          this.eventsService.loadByID(this.id).subscribe(results => {
            //this.loadEmptyMsg = true;
            this.events = results;
            this.setForm();
          });
        }
    });

    this.month = new Date().getMonth()
    this.day = new Date().getDate()

  }

  setForm() {
    this.f.description.setValue(this.events.description);
    this.f.color.setValue(this.events.color);
    this.f.status.setValue(this.events.status);
    this.f.title.setValue(this.events.title);
    this.f.organizer.setValue(this.events.organizer);
    this.f.allDay.setValue(this.events.allDay);
    this.f.isPublic.setValue(this.events.isPublic);
    this.f.startDate.setValue(this.events.startDate.toISODate());
    this.f.endDate.setValue(this.events.endDate.toISODate());
    this.f.startTime.setValue(this.events.startDate.toFormat('HH:mm a'));
    this.f.endTime.setValue(this.events.endDate.toFormat('HH:mm a'));
    this.f.location_URL.setValue(this.events.location_URL);
  }
  
  buildForm() {
    console.log("build form ");
    this.eventsForm = this.fb.group({
      'ID': [this.id, [
        //Validators.required
      ]],
      'description': ['', [
        Validators.maxLength(5000)
      ]],
      'color': ['', [
        Validators.maxLength(50)
      ]],
      'title': ['', [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(1)
      ]],
      'startDate': [new Date(), [Validators.required]],
      'endDate': ["", []],
      'startTime': ["", []],
      'endTime': ["", []],
      'location_URL': ["", []],
      'organizer': [],
      'allDay': [false, []],
      'endAfter':[],
      'repeatOnMonth':[],
      'repeatOn':[],
      'pattern':[],
      'repeatOnWeekDays':[],
      'endBy':[],
      'repeatEvery':[],
      'status':[],
      'invitedUsers':[],
      'isPublic':[true,[]]
    });

  }

  get f() { return this.eventsForm.controls; }

  saveData() {
    var finalStartDate = new Date(this.f.startDate.value);
    var finalEndDate =new Date(this.f.endDate.value);
    finalStartDate = new Date(Date.parse(finalStartDate.toDateString() + 'UTC' + this.f.startTime.value));
    finalEndDate = new Date(Date.parse(finalEndDate.toDateString() + 'UTC' + this.f.endTime.value));
    var events: Events = {
      id: this.id,
      title: this.f.title.value,
      description: this.f.description.value,
      color: this.f.color.value,
      galleyId: 0,
      status:this.f.status.value,
      location_URL:this.f.location_URL.value,
      organizer: this.f.organizer.value,
      allDay: this.f.allDay.value,
      startDate: finalStartDate,
      endDate: finalEndDate,
      isRecursive: this.isRecursive,
      parentEventId: 0,
      invitedUsers:this.f.invitedUsers.value,
      isPublic:this.f.isPublic.value
      
      
    }
    if(this.isRepeat==1){
      if(this.pattern==1){
        this.repeatOn=0
        this.repeatOnMonth =0
      }
      if(this.pattern==2){
        this.repeatOn=this.f.repeatOn.value
        var repeatOnWeekDays = this.repeatOnWeekDays.map(str => {return +str;});
        this.repeatOnWeekDays=repeatOnWeekDays
        this.repeatOnMonth =0
      }
      if(this.pattern==3){
        this.repeatOn=this.f.repeatOn.value
        this.repeatOnMonth =0
      }
      if(this.pattern==4){
        this.repeatOn=this.f.repeatOn.value
        this.repeatOnMonth =this.f.repeatOnMonth.value+1
      }
      var recurrenceEvents: RecurrenceEvent = {
        id:this.id,
        pattern: this.pattern,
        endAfter: this.f.endAfter.value,
        endBy: this.f.endBy.value,
        repeatEvery: this.f.repeatEvery.value,
        repeatOn: this.repeatOn,
        repeatOnWeekDays: this.repeatOnWeekDays,
        repeatOnMonth: this.repeatOnMonth,
        event:events,
      }
    }
    
    var observer: Observable<any>;
    if (events.id == null || events.id <= 0){
      if(this.isRepeat==0){
        observer = this.eventsService.add(events);
      }else{
        observer = this.eventsService.recurrenceAddEvents(recurrenceEvents);
      }
    }
    else{
      if(this.isRepeat==0){      
        observer = this.eventsService.edit(events);
      }else{
        observer = this.eventsService.recurrenceEditEvents(recurrenceEvents);

      }
    }
    observer.subscribe(result => {
      console.log("Response from server:");
      console.log(result); 
      this.id = result.id;

      this.snakbar.open('Event added successfully.', 'Dismise', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    });
  }

  revert() {
    this.eventsForm.reset();
  }

  allDay(value){
    if(value ==1){
      this.showHideTime =false
      this.f.startTime.setValue('')
      this.f.endTime.setValue('')
    }else{
      this.showHideTime =true
    }
  }
  
  isVirtual(value:any):void {
    this.f.location_URL.setValue('')    
    if(value.checked) {
      this.inputURLType = 'url'
      this.locationOrUrl="Event URL";
      this.linkOrLocationIcon="link";
    }
    else {
      this.inputURLType = 'text'      
      this.locationOrUrl="Event Location" ;
      this.linkOrLocationIcon="location_on" ;    
    }
  }
  changedWeek(value){
    this.repeatOnWeekDays=value
     
  }
  checkRepeat(value:number){
    this.isRepeat=value
    if(value==1){
      this.isRecursive=true
      this.f.pattern.setValue(this.repeatPattern[0])
      this.f.repeatEvery.setValue(1)
      this.f.endAfter.setValue(1)
      this.pattern=1
      this.repeatType=this.repeatPattern[0]  
    }else{
      this.isRecursive=false
    }
  }
  onRepeatChange(value:string){
    if(value=="Daily"){
      this.pattern=1
    }
    if(value=="Monthly"){
      this.pattern=3
    }
    if(value=="Yearly"){
      this.pattern=4      
    }
    if(value=="Weekly"){
      this.pattern=2
      this.f.repeatOn.setValue(0)
      
    }else{
      this.repeatOnWeekDays=[]
      this.f.repeatOn.setValue(this.day)
    }
    this.f.repeatOnMonth.setValue(this.month)
    this.repeatType=value
  }
  radioChange(event) {
    if(event=="On") {
      this.f.endBy.setValue(null)
      this.f.endAfter.setValue(0)
      this.isDisabledOccurence=true
      this.isDisabledEndDate=false
    }
    else {
      this.f.endBy.setValue(null)
      this.f.endAfter.setValue(1)
      this.isDisabledOccurence=false
      this.isDisabledEndDate=true
    }
  }
  onMonthChange(value){
    console.log(value)
  }
  isPublic(value){
    value==0?this.isPublicEvent="Private":this.isPublicEvent="Public"
     
  }
  private isValidUrl(url: string): boolean {
    // Basic URL validation (you can use a more robust method if needed).
    // This regular expression checks if the URL starts with http:// or https://.
    const urlPattern = /^(http|https):\/\/(.*)$/;
    return urlPattern.test(url);
  }
  
}

