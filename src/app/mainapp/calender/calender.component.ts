import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { EventsService } from 'src/app/services/events.service';
import { MatDialog } from '@angular/material/dialog';
import { Events } from 'src/app/models/Events';
import { CalenderdetailComponent } from '../calenderdetail/calenderdetail.component';


const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss']
})
export class CalenderComponent implements OnInit {

  public loadEmptyMsg: boolean = false;

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
        console.log(event);

        var selectedEvent = this.eventsData.find(x => x.id == event.id);
        this.onEdit(selectedEvent)

        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        console.log(event);
        this.ondelete(event.id);

        //this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();
  events: CalendarEvent[];
  eventsData: Events[];

  activeDayIsOpen: boolean = true;

  //constructor(private modal: NgbModal) {}
  constructor(private eventsService: EventsService, private dialog: MatDialog) { }

  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.eventsService.loadData().subscribe(results => {
      this.loadEmptyMsg = true;
      console.log('come to the subscriber');
      this.eventsData = results;
      this.events = results.map(e => this.mapToEvent(e));
    });
  }

  mapToEvent(event: Events): CalendarEvent {
    console.log(typeof (event.startDate));
    var calender_event: CalendarEvent =
    {
      id: event.id,
      start: event.startDate.toJSDate(), // subDays(startOfDay(new Date()), 1),
      end: event.startDate.toJSDate(),
      title: event.title,
      color: colors.red,
      actions: this.actions,
      allDay: event.allDay,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
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

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      }
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  onAdd() {
    const dialogRef = this.dialog.open(CalenderdetailComponent, {
      width: '650px',
      //data: { id: 0, sectionID: this.sectionID }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }

  onEdit(data: any) {
    console.log("Calling edit answer list");
    console.log(data);

    const dialogRef = this.dialog.open(CalenderdetailComponent, {
      width: '650px',
      data: { id: data.id, events: data }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


  ondelete(id: any) {
    this.eventsService.delete(id).subscribe(params => {
      if (params) {
        this.events = this.events.filter(iEvent => iEvent.id !== id);
        // const index: number = this.dataSource.data.indexOf(data);
        // if (index !== -1) {
        //   this.dataSource.data.splice(index, 1);
        // }
      }
    });
  }
}
