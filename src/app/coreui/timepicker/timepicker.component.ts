import { Time } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DateTime } from "luxon";

@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss']
})
export class TimepickerComponent implements OnInit {

  constructor() { }

  DurationType: SelectModel[] = [
    { id: '0', viewValue: 'Years' },
    { id: '1', viewValue: 'Months' },
    { id: '2', viewValue: 'Days' },
    { id: '3', viewValue: 'Hours' },
    { id: '4', viewValue: 'Minutes' }
  ];

  @Input() selectedDurationType: number = 0;
  @Input() SelectedTime: DateTime;
  @Output() sizeChange = new EventEmitter<DateTime>();

  ngOnInit(): void {
  }

}
