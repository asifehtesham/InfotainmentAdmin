import { ConnectedPosition } from '@angular/cdk/overlay';
import { Time } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DateTime } from "luxon";

@Component({
  selector: 'app-durationpicker',
  templateUrl: './durationpicker.component.html',
  styleUrls: ['./durationpicker.component.scss']
})
export class DurationpickerComponent implements OnInit {

  constructor(private fb: FormBuilder) {
    // this.durationForm = fb.group({
    //   config: fb.array([])
    // });
    // const add = this.durationForm.get('config') as FormArray;
  }

  DurationType: SelectModel[] = [
    { id: '0', viewValue: 'Years' },
    { id: '1', viewValue: 'Months' },
    { id: '2', viewValue: 'Days' },
    { id: '3', viewValue: 'Hours' },
    { id: '4', viewValue: 'Minutes' },
    { id: '5', viewValue: 'Seconds' }
  ];
  isOpen: boolean = false;
  @Input() label: string = "Duration";
  canDisplayLabel: boolean = true;

  @Input() allowedTypes: string[] = ["0", "1", "2", "3", "4", "5"];
  @Input() SelectedTime: Duration;
  @Output() SelectedTimeChange = new EventEmitter<Duration>();

  durationForm: FormGroup;
  config: FormArray;


  ngOnInit(): void {

    this.config = this.fb.array([]);
    this.DurationType.filter(x => this.allowedTypes.includes(x.id)).forEach((type) => {
      var value = 0;
      switch (type.id) {
        case "0": value = this.SelectedTime.years; break;
        case "1": value = this.SelectedTime.months; break;
        case "2": value = this.SelectedTime.days; break;
        case "3": value = this.SelectedTime.hours; break;
        case "4": value = this.SelectedTime.minutes; break;
        case "5": value = this.SelectedTime.seconds; break;
        default: value = 0;
      };
      this.config.push(

        this.fb.group({
          duration: [type.viewValue],
          value: [value]
        })
      );
    });

    this.config.valueChanges.subscribe(() => this.raiseEvent());
  }

  onClickPlus(durationGroup: FormGroup, duration: any) {
    durationGroup.setValue({ duration: durationGroup.value.duration, value: durationGroup.value.value + 1 });
  }
  onClickMinus(durationGroup: FormGroup) {
    var val = durationGroup.value.value;
    val = val <= 0 ? val : val - 1;
    durationGroup.setValue({ duration: durationGroup.value.duration, value: val });
  }

  raiseEvent() {
    this.config.controls.forEach(x => {
      switch (x.value.duration) {
        case "Years": this.SelectedTime.years = x.value.value; break;
        case "Months": this.SelectedTime.months = x.value.value; break;
        case "Days": this.SelectedTime.days = x.value.value; break;
        case "Hours": this.SelectedTime.hours = x.value.value; break;
        case "Minutes": this.SelectedTime.minutes = x.value.value; break;
        case "Seconds": this.SelectedTime.seconds = x.value.value; break;
        default: break;
      }
    });

    this.SelectedTimeChange.emit();
  }
  checkDisplayLabels(): void {
    this.config.controls.forEach(form => {
      this.canDisplayLabel = false;
      if (form.value.value > 0) {
        this.canDisplayLabel = true;
      }
    });
  }
  btnClick() {
    this.isOpen = !this.isOpen;
  }
}
