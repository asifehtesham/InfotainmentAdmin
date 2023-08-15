import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Chart, registerables } from 'chart.js';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-event-calender',
  templateUrl: './event-calender.component.html',
  styleUrls: ['./event-calender.component.scss']
})
export class EventCalenderComponent implements OnInit, AfterViewInit {

  constructor() {
    Chart.register(...registerables);
  }
  // refresh: Subject<any> = new Subject();
  // viewDate: Date = new Date();
  // activeDayIsOpen: boolean = false;
  //@ViewChild('myChart', { static: true }) myChart: ElementRef;
  @ViewChild('myChart', { static: false }) private myChart: ElementRef;

  myDonutChart: any;
  selected: Date | null;

  data = {
    labels: [
      'Exam',
      'Assignments',
      'Quiz'
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [1, 5, 3],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)'
      ],
      borderWidth: 1,
      hoverOffset: 4
    }]
  };

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    //ctx = document.getElementById('myChart');
    this.myDonutChart = new Chart(this.myChart.nativeElement, {
      type: 'doughnut',
      data: this.data,
      options: {
        cutout: '90%',
        //radius: 100,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            align: 'start',
            labels: {
              color: 'rgb(108, 99, 132)',
              boxHeight: 5,
              boxWidth: 5,
              textAlign: 'left'
            }
          }
        }
      }
    });
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

  dayClicked(date: Date) {

  }
  /*
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
    }*/

}
