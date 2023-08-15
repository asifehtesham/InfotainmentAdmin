import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss']
})
export class FilterPanelComponent implements OnInit {

  constructor() { }


  languageOptions: SelectModel[] = [
    { id: '0', viewValue: 'English' },
    {id: '1', viewValue: 'Arabic' },
    { id: '2', viewValue: 'French' }
  ];

  levelOptions: SelectModel[] = [
    { id: '0', viewValue: 'All Level' },
    { id: '1', viewValue: 'Beginner' },
    { id: '2', viewValue: 'Intermediate' },
    { id: '3', viewValue: 'Expert' }
  ];

  ratingOptions: SelectModel[] = [
    { id: '4.5', viewValue: '4.5 & above' },
    { id: '4', viewValue: '4.0 & above' },
    { id: '3.5', viewValue: '3.5 & above' },
    { id: '3', viewValue: '3.0 & above' }
  ];

  ngOnInit(): void {
  }

}
