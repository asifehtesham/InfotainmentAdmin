import { E } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-datetimepicker',
  templateUrl: './datetimepicker.component.html',
  styleUrls: ['./datetimepicker.component.scss']
})
export class DatetimepickerComponent implements OnInit {

  constructor() { }
  @Input() label: string;
  @Input() selectedDate: DateTime;
  @Output() selectedDateChange = new EventEmitter<DateTime>();

  date: Date;
  time: DateTime;
  sTime: string;

  ngOnInit(): void {
    this.date = this.selectedDate.toJSDate();
    this.time = this.selectedDate;
    this.sTime = this.time.toLocaleString(DateTime.TIME_SIMPLE); //hour + ":" + this.time.minute;
  }

  dateChange(event) {
    this.date = event.value;
    this.valueChange();
  }

  timeChanged(event) {
    this.time = DateTime.fromFormat(event, "h:mm a");
    this.valueChange();
  }

  valueChange() {
    this.selectedDate = DateTime.fromJSDate(this.date);
    this.selectedDate = this.selectedDate.set({ hour: this.time.hour, minute: this.time.minute });

    this.selectedDateChange.emit(this.selectedDate);
  }

}
