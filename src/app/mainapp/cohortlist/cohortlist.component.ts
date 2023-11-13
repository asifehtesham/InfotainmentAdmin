import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, timer, interval, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators'; 
import { Cohort } from 'src/app/models/Cohort';
import { UserService } from 'src/app/services/user.service';
import { CohortService } from 'src/app/services/cohort.service';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { CohortdetailComponent } from '../cohortdetail/cohortdetail.component';
import { AssignUsersCohortComponent } from '../assignusers/assignusers.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from "sweetalert2";

@Component({
  selector: 'app-cohortlist',
  templateUrl: './cohortlist.component.html',
  styleUrls: ['./cohortlist.component.scss']
})
export class CohortlistComponent {

  subscription: Subscription;
  displayedColumns: string[] = ['select',
    'name',
    'noOfUsers',
    'description',
    'isVisible',
    'id'];
  cohort = [];
  Ids:any=[]

  public dataSource:any = new MatTableDataSource<Cohort>();
  selection = new SelectionModel<Cohort>(true, []);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortable: MatSort;

  constructor(
    private snakbar: MatSnackBar,
    private http: HttpClient, 
    private cohortService: CohortService, 
    private dialog: MatDialog) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sortable;
    this.loadData()
  }
 
  loadData() {
    this.cohortService.loadData().subscribe(results => {
      this.dataSource.data = results;
    });
  }
  onAddUsers(id){
    const dialogRef = this.dialog.open(AssignUsersCohortComponent, {
      width: '1050px',
      data: { id: id }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }

  ondelete(cohort: Cohort) {
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
        this.cohortService.delete(cohort.id).subscribe(params => {
          console.log('come to the subscriber: ');
          console.log(params);
    
          if (params) {
            this.snakbar.open('Cohort has been deleted successfully.', 'Dismise', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
            this.loadData()
          }
        });
      }
      else {
        Swal.fire(
          'Cancelled',
          'Your Cohort is safe :)',
          'error'
        )
      }
    })
  }

  onRemoveAll() { 
    if(this.selection.selected.length >0){
      this.Ids=[]
      this.selection.selected.forEach(element => {
        this.Ids.push(element.id)
      }); 
      
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
          var IdsforDelete =this.Ids
          console.log('remove all',IdsforDelete) 
          this.cohortService.deleteAll(IdsforDelete).subscribe(params => {
            console.log('come to the subscriber: ');
            this.loadData()
          })
        }
        else{
          Swal.fire(
            'Cancelled',
            'Your cohort is safe',
            'error'
          )
        }
      })
    }else{
      alert('Please select atleast one row to delete.')
    }
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

  checkboxLabel(row?: Cohort): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  onAdd() {
    const dialogRef = this.dialog.open(CohortdetailComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result)
      if(result)
      this.loadData()
      this.snakbar.open('Cohort created successfully.', 'Dismise', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });

    });
  }

  onEdit(cohort: Cohort) {
    const dialogRef = this.dialog.open(CohortdetailComponent, { 
      width: '650px',
      data: { cohort: cohort }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result)
      this.loadData()
      
      this.snakbar.open('Cohort updated successfully.', 'Dismise', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    });
  }
}
