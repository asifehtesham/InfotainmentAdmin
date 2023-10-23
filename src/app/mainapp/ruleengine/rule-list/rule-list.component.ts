
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, timer, interval, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

import { Rule } from 'src/app/models/ruleengine/Rule';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { RuleService } from 'src/app/services/ruleengine/rules.service';
import { RuleDetailComponent } from '../rule-detail/rule-detail.component';
//import { RuleNewversionComponent } from '../rule-newversion/rule-newversion.component';
import Swal from "sweetalert2";
import { MatSnackBar } from '@angular/material/snack-bar';
import { OpenAIService } from 'src/app/services/openai.service';
@Component({
  selector: 'app-rule-list',
  templateUrl: './rule-list.component.html',
  styleUrls: ['./rule-list.component.scss']
})

export class RuleListComponent implements OnInit, AfterViewInit {

  subscription: Subscription;
  // currentVersion?: string;
  // publishedVersion?: string;
  // availableVersion?: string;
  displayedColumns: string[] = ['select',
    'ruleName',
    //'link',
    'lastEditDate',
    'id'];
  rule = [];
  search = new FormControl();
  public loadEmptyMsg: boolean = false;
  public dataSource = new MatTableDataSource<Rule>();
  selection = new SelectionModel<Rule>(true, []);

  index: number = 1;
  limit: number = 10;
  pageTotal: number = 20;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortable: MatSort;

  constructor(private http: HttpClient, private ruleService: RuleService, private dialog: MatDialog,
    private openAIService: OpenAIService,
    private snakbar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sortable;

    this.loadData();

    this.search.valueChanges.subscribe(
      value => {
        if (value.length == 0) {

          this.ruleService.loadData(this.index, this.limit).pipe(map((results => {
            //return results;
            this.dataSource.data = results;
          })));

          return;
        }

        this.ruleService.search(value).subscribe(results => {
          //this.loadEmptyMsg = true;
          console.log('come to the subscriber');
          this.dataSource.data = results;
          return results;
        });
      });

  }
  ngAfterViewInit(): void { }
  // ngAfterViewInit(): void {
  //   console.log("ngAfterViewInit");
  //   this.paginator.page.subscribe(() => {
  //     this.router.navigate([''], {
  //       relativeTo: this.route,
  //       queryParams: { page: this.paginator.pageIndex + 1 },
  //       queryParamsHandling: 'merge',
  //     });
  //   });
  // }

  loadData() {
    this.ruleService.loadData(this.index, this.limit).subscribe(results => {
      this.loadEmptyMsg = true;
      console.log('come to the subscriber');
      this.dataSource.data = results;
    });
  }

  page(event) {
    console.log("on page change");
    //console.log(event);
    console.log(event.pageIndex);
    console.log(event.pageSize);
    // length
    // pageIndex
    // pageSize
    // previousPageIndex
    this.index = event.pageIndex + 1;
    this.limit = event.pageSize;

    this.loadData();
    // this.ruleService.loadData(this.index, this.limit).pipe(map((results => {
    //   this.dataSource.data = results;
    // })));
  }
  chkActive_changed(ambulance: any, $event: MatSlideToggleChange) {

    console.log("chkActive_changed: " + ambulance.id);
    console.log($event.checked);

    ambulance.IsActive = $event.checked;
    this.ruleService.editactive(ambulance).subscribe();

  }

  ondelete(data: any) {

    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to delete this?",
      icon: "warning",
      showConfirmButton: true,
      showCancelButton: true
    })
      .then((willDelete) => {
        if (willDelete.isConfirmed) {
          this.ruleService.delete(data.id).subscribe(result => {
            if (result) {
              this.snakbar.open('Your record has been deleted successfully.', 'Ok', {
                duration: 2000,
              });

              if (result) {
                const index: number = this.dataSource.data.indexOf(data);
                if (index !== -1) {
                  this.dataSource.data.splice(index, 1);
                }
              }
            }
          });
        } else {
          this.snakbar.open('Delete action dismissed.', 'Ok', {
            duration: 2000,
          });
        }
      });
    /*
        this.ruleService.delete(ambulance.id).subscribe(params => {
          console.log('come to the subscriber: ');
          console.log(params);
    
          if (params) {
            const index: number = this.dataSource.data.indexOf(ambulance);
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
            }
          }
        });*/
  }
  onRemoveAll() {
    if (this.selection.selected.length <= 0) {
      this.snakbar.open('Select one or more record to perrule this action.', 'Ok', {
        duration: 2000,
      });
      return;
    }
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to delete record(s)?",
      icon: "warning",
      showConfirmButton: true,
      showCancelButton: true
    })
      .then((willDelete) => {
        if (willDelete.isConfirmed) {

          var ids = this.selection.selected.map(x => x.id).join(",");
          this.ruleService.deleteAll(ids).subscribe(result => {
            if (result) {
              this.snakbar.open('Your record(s) has been deleted successfully.', 'Ok', {
                duration: 2000,
              });

              this.loadData();
              this.selection.clear();
            }

          });
        } else {
          this.snakbar.open('Delete action dismissed.', 'Ok', {
            duration: 2000,
          });
        }
      });
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }
  checkboxLabel(row?: Rule): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  onAdd() {
    const dialogRef = this.dialog.open(RuleDetailComponent, {
      width: '650px',
      //data: { id: 0, sectionID: this.sectionID }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadData();
      this.snakbar.open('Your record has been added successfully.', 'Ok', {
        duration: 2000,
      });
    });
  }

  onEdit(data: any) {
    console.log("Calling edit answer list");
    console.log(data);

    const dialogRef = this.dialog.open(RuleDetailComponent, {
      width: '650px',
      data: { id: data.id, rule: data }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadData();
   
    });
  }
  /*
    addVersion(rule: Rule) {
      const dialogRef = this.dialog.open(RuleNewversionComponent, {
        width: '650px',
  
        data: { id: rule.Id, AvailableVersion: rule.availableVersion }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.loadData();
        this.snakbar.open('New version added successfully.', 'Ok', {
          duration: 2000,
        });
      });
    }
    currentVersionChange(event, rule: Rule) {
  
      console.log("currentVersionChange");
      console.log(event);
      console.log(rule);
  
      if (event.value == 0) {
        //opne dialog
        this.addVersion(rule);
      }
      else {
        //call api tp change the version
        this.ruleService.change_version(rule.id, event.value).subscribe(params => {
          console.log('come to the subscriber: ');
          console.log(params);
          this.loadData();
          this.snakbar.open('Selected version has been changed.', 'Ok', {
            duration: 2000,
          });
        });
      }
  
    }*/
  reload() { }
}
