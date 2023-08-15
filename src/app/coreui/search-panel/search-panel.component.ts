import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { map, Observable } from 'rxjs';
import { searchAnimation } from 'src/app/animations';
import { SearchModel } from 'src/app/models/search_model';

@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss'],
  animations: [searchAnimation]
})
export class SearchPanelComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  searchForm: FormGroup;
  search = new FormControl();
  //filteredOptions: Observable<Course[]>;
  @Input() showFilter: boolean = false;
  @Input() showSort: boolean = true;
  @Input() isExpanded: boolean = true;
  @Input() insideToolbar: boolean = true;
  switchFilter: boolean = false;

  @Output() onSearch = new EventEmitter<SearchModel>();
  @Output() onSwitchFilter = new EventEmitter<boolean>();

  //sortBy: number = 0;
  //@ViewChild('auto', { read: MatAutocompleteTrigger, static: true }) auto: MatAutocompleteTrigger;  
  @ViewChild(MatAutocompleteTrigger) auto: MatAutocompleteTrigger;

  searchHistory: String[] = [];

  sortOptions: SelectModel[] = [
    { id: '0', viewValue: 'Most Relevance' },
    { id: '1', viewValue: 'Most Enrolled' },
    { id: '2', viewValue: 'Highest Rated' },
    { id: '3', viewValue: 'Newest' },
  ];


  ngOnInit() {
    this.buildForm();

    this.searchHistory = JSON.parse(localStorage.getItem("search_history"));
    if (this.searchHistory == null)
      this.searchHistory = [];

    //this.search.valueChanges.subscribe(
    this.f.SearchText.valueChanges.subscribe(
      value => {
        console.log("come to search.valueChanges.subscriber");

        // if (value.length == 0) {
        //   this.filteredOptions = this.courseService.loadDataByCategoryID(0).pipe(map((results => {
        //     return results;
        //   })));
        //   return;
        // }

        // this.filteredOptions = this.courseService.search(value).pipe(map((results => {
        //   console.log('come to the subscriber');
        //   return results;
        // })));
      });


  }

  reload() {
    //this.search.setValue("");
    this.f.SearchText.setValue("");
  }

  addHistory(history: string) {

    const index: number = this.searchHistory.indexOf(history);
    if (index == -1) {
      this.searchHistory.push(history);

      localStorage.setItem("search_history", JSON.stringify(this.searchHistory));
    }

    this.auto.closePanel();
    this.searchSubmit();
  }
  sortChange(evnt: any) {
    this.searchSubmit();
  }
  searchSubmit() {

    console.log("searchSubmit");
    console.log(this.f.SearchText.value);
    console.log(this.f.SortBy.value);

    var searchModel: SearchModel = {
      SearchText: this.f.SearchText.value,
      SortBy: this.f.SortBy.value
    }
    this.onSearch.emit(searchModel);
  }

  SwitchFilter() {
    this.switchFilter = !this.switchFilter;
    this.onSwitchFilter.emit(this.switchFilter);
  }
  removeSearchHistory(history: string) {
    console.log("removeSearchHistory: " + history);
    const index: number = this.searchHistory.indexOf(history);
    if (index !== -1) {
      this.searchHistory.splice(index, 1);
    }

    localStorage.setItem("search_history", JSON.stringify(this.searchHistory));

  }

  buildForm() {
    console.log("build form ");
    this.searchForm = this.fb.group({
      'SearchText': ['', [
        Validators.required
      ]],
      'SortBy': ['', []]
    });
  }

  get f() { return this.searchForm.controls; }

}
