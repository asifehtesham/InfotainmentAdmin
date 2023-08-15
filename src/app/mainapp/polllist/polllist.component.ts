import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, timer, interval, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Poll } from 'src/app/models/Poll';
import { PollService } from 'src/app/services/poll.service';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { PolldetailComponent } from '../polldetail/polldetail.component';
import Swal from "sweetalert2";


@Component({
  selector: 'app-polllist',
  templateUrl: './polllist.component.html',
  styleUrls: ['./polllist.component.scss']
})

export class PolllistComponent {
  subscription: Subscription;
  displayedColumns: string[] = [
    'select',
    'title',
    'slug',
    'availableStartDate',
    'availableEndDate',
    'canVisitorVote',
    'canVoterSeeResult',
    'isPublish',
    'ID'
  ];

  poll = [];
  search = new FormControl();
  public loadEmptyMsg: boolean = false;
  public dataSource = new MatTableDataSource<Poll>();
  selection = new SelectionModel<Poll>(true, []);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortable: MatSort;

  constructor(private http: HttpClient, private pollService: PollService, private dialog: MatDialog) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sortable;
    this.loadData()
  }

  loadData() {
    this.pollService.loadData().subscribe(results => {
      this.loadEmptyMsg = true;
      console.log('come to the subscriber');
      this.dataSource.data = results;
    });

    this.search.valueChanges.subscribe(
      value => {
        if (value.length == 0) {
          this.pollService.loadData().pipe(map((results => {
            //return results;
            this.dataSource.data = results;
          })));

        return;
      }

      this.pollService.search(value).subscribe(results => {
        //this.loadEmptyMsg = true;
        console.log('come to the subscriber');
        this.dataSource.data = results;
        return results;
      });
    });
  }
  chkActive_changed(poll: any, $event: MatSlideToggleChange) {

    console.log("chkActive_changed: " + poll.id);
    console.log($event.checked);

    poll.IsActive = $event.checked;
    this.pollService.editactive(poll).subscribe();

  }
  ondelete(poll: Poll) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("delete: " + poll.id);
        this.pollService.delete(poll.id).subscribe(params => {
          
          console.log(params);
          if(params) {
            this.loadData();
          }
        });
        
      }
      else{
        Swal.fire(
          'Cancelled',
          'Your Poll is safe :)',
          'error'
        )
      }
    })
   
  }
  onRemoveAll() {
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
  checkboxLabel(row?: Poll): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
  onAdd() {
    const dialogRef = this.dialog.open(PolldetailComponent, {
      width: '650px', 
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.loadData()
      }
      console.log('The dialog was closed');

    });
  }
  onEdit(id: number) {
    console.log("Calling edit list");
    console.log(id);

    const dialogRef = this.dialog.open(PolldetailComponent, {
      width: '650px',
      data: { id: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.loadData()
      }
      console.log('The dialog was closed');
    });
  }
  reload() { }
}
