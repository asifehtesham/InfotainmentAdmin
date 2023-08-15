import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-icon-vertical',
  templateUrl: './card-icon-vertical.component.html',
  styleUrls: ['./card-icon-vertical.component.scss']
})
export class CardIconVerticalComponent implements OnInit {

  constructor() { }

  @Input() label: string;
  @Input() total: string;
  @Input() icon: string;

  @Input() background: string;

  ngOnInit(): void {
    this.icon = "fa-" + this.icon;
  }

}
