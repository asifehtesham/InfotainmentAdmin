import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-card-icon',
  templateUrl: './card-icon.component.html',
  styleUrls: ['./card-icon.component.scss']
})
export class CardIconComponent implements OnInit {

  constructor() { }

  @Input() layout: string = "horizontal"; //vertical, horizontal
  @Input() label: string;
  @Input() total: string;
  @Input() icon: string;

  @Input() color: string = "#111032";
  @Input() background: string = "#fff";

  @ViewChild('myChart', { static: false }) private myChart: ElementRef;

  myDonutChart: any;

  ngOnInit(): void {
    this.icon = "fa-" + this.icon;
  }


  ngAfterViewInit(): void {

    var data = {
      labels: [
        'Count'
      ],
      datasets: [{
        label: 'My First Dataset',
        data: [300, 50, 100],
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
  }
}
