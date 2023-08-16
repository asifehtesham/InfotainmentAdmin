import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs'; 
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent,getWeekViewPeriod, CalendarView, CalendarDateFormatter, DateAdapter } from 'angular-calendar';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { EventsService } from 'src/app/services/events.service';
import { MatDialog } from '@angular/material/dialog';
import { Events } from 'src/app/models/Events';
import { CalenderdetailComponent } from '../calenderdetail/calenderdetail.component';
import { DateTime } from 'luxon';
import Swal from "sweetalert2";

const colors: any = {
  blue: {
    primary: '#1e90ff',
  },
  green:{
    primary: '#008000',
  },
  orange:{
    primary: '#ffa500', 
  },
  red: {
    primary: '#ad2121',
  },
  purple: {
    primary: '#800080',
  },
  yellow: {
    primary: '#e3bc08',
  }
};

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss']
})
export class CalenderComponent implements OnInit {

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  selected: Date | null;
  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        // console.log(event);

        var selectedEvent = this.eventsData.find(x => x.id == event.id);
        this.onEdit(selectedEvent)

        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times ml-2"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event }): void => {
        this.ondelete(event.id,event.parentEventId);

        //this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();
  events: CalendarEvent[];
  eventsData: Events[];
  start = DateTime.utc().startOf('month').toISO();
  end = DateTime.utc().endOf('month').toISO();

  activeDayIsOpen: boolean = false;
  constructor(private dateAdapter:DateAdapter, private eventsService: EventsService, private dialog: MatDialog) { }

  ngOnInit() {
    this.loadData(this.start,this.end);
  }

  loadData(start, end) {
    
    this.eventsService.loadData(start, end).subscribe(results => {
      this.eventsData = results;
      this.events = results.map(e => this.mapToEvent(e));
    });
  }

  colorEvent: any;
  mapToEvent(event: Events): CalendarEvent {
    switch ( event.color ) {
      case event.color="Red":
      this.colorEvent = colors.red
      break;
      case event.color="Green":
      this.colorEvent = colors.green     
      break;
      case event.color="Blue":
      this.colorEvent=colors.blue
      break;
      case event.color="Purple":
      this.colorEvent=colors.purple                
      break;
      case event.color="Yellow":
      this.colorEvent=colors.yellow
      break;
      case event.color="Orange":
      this.colorEvent=colors.orange
      break;
      default: 
      break;
    }
    
    var calender_event =
    {
      id: event.id,
      start: event.startDate.toJSDate(), // subDays(startOfDay(new Date()), 1),
      end: event.startDate.toJSDate(),
      title: event.title,
      parentEventId:event.parentEventId,
      color: this.colorEvent,
      actions: this.actions,
      allDay: event.allDay,
      
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: false
    };

    return calender_event;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
     
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
     
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      const date = cellDate.getDate();

      // Highlight the 1st and 20th day of each month.
      return date === 1 || date === 20 ? 'example-custom-date-class' : '';
    }

    return '';
  };

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    //this.modal.open(this.modalContent, { size: 'lg' });
  }

  setView(view: CalendarView) {
    console.log(this.view,this.viewDate)
    this.view = view;
    this.toogleDate()
  }

  closeOpenMonthViewDay(Date:any) {
    this.toogleDate()
    this.activeDayIsOpen = false;
  }

  toogleDate(){
    console.log(this.view)
    if(this.view == 'day'){
      var startDay = DateTime.fromISO(this.viewDate.toISOString()).toUTC().startOf('day').toISO()      
      var endDay = DateTime.fromISO(this.viewDate.toISOString()).toUTC().endOf('day').toISO()      
      console.log("startDay",startDay,"endDay",endDay)
      this.loadData(startDay,endDay)
    }
    
    if(this.view == 'week'){
      const { viewStart, viewEnd } = getWeekViewPeriod(this.dateAdapter,this.viewDate,0)
      console.log("startWeek", viewStart, "endWeek", viewEnd)
      this.loadData(viewStart.toISOString(),viewEnd.toISOString())
      
    }
    if(this.view == 'month'){
      var startMonth = DateTime.fromISO(this.viewDate.toISOString()).toUTC().startOf('month').toISO()
      var endMonth = DateTime.fromISO(this.viewDate.toISOString()).toUTC().endOf('month').toISO()
      console.log('startMonth', startMonth, "EndMonth", endMonth)
      this.loadData(startMonth,endMonth)
    }
  }

  onAdd() {
    const dialogRef = this.dialog.open(CalenderdetailComponent, {
      width: '1050x',
      //data: { id: 0, sectionID: this.sectionID }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.loadData(this.start,this.end)
      }
      console.log('The dialog was closed');

    });
  }

  onEdit(data: any) {
    console.log("Calling edit answer list");
    // console.log(data);

    const dialogRef = this.dialog.open(CalenderdetailComponent, {
      width: '1050px',
      data: { id: data.id, events: data }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result){
        this.loadData(this.start,this.end)
      }
    });
  }

  ondelete(id: any, parentEventId:any) {
    console.log(id,parentEventId)
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      input: 'checkbox',
      inputPlaceholder: "Also delete It's recurrence",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        
        if(result.value == 0){
          this.deleteSingle(id)
        }else{
            if(parentEventId == 0){
              this.deleteRecurrence(id)
            }else{
              this.deleteRecurrence(parentEventId) 
            }
        }
      }
      else{
        Swal.fire(
          'Cancelled',
          'Your event is safe :)',
          'error'
        )
      }
    })
  }

  deleteRecurrence(id){
    this.eventsService.deleteRecurrence(id).subscribe(params => {
      if (params) {
        // this.events = this.events.filter(iEvent => iEvent.id !== id);
        this.loadData(this.start,this.end)
      }
    });
  }

  deleteSingle(id){
    this.eventsService.delete(id).subscribe(params => {
      if (params) {
        // this.events = this.events.filter(iEvent => iEvent.id !== id);
        this.loadData(this.start,this.end)
      }
    });
  }
}
