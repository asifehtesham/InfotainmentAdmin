import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, timer, interval, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from "sweetalert2";

import { User } from 'src/app/models/Users';
import { UserService } from 'src/app/services/user.service';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { UserdetailComponent } from '../userdetail/userdetail.component';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent {

  subscription: Subscription;
  displayedColumns: string[] = ['select',
    'username',
    'email',
    'mobile',
    'firstName',
    'lastName',
    'active',
    'id'];
  user = [];
  search = new FormControl();
  public loadEmptyMsg: boolean = false;
  public dataSource = new MatTableDataSource<User>();
  selection = new SelectionModel<User>(true, []);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortable: MatSort;

  constructor(private snakbar: MatSnackBar,private http: HttpClient, private userService: UserService, private dialog: MatDialog) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sortable;
    this.loadData()
  }

  loadData(){  
    this.userService.loadData().subscribe(results => {
      console.log(results)
      this.loadEmptyMsg = true;
      console.log('come to the subscriber');
      this.dataSource.data = results;
    });
  }
  ondelete(user: User) {
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
        console.log("delete: " + user.id);
        this.userService.delete(user.id).subscribe(params => {
          console.log('come to the subscriber: ');
          console.log(params);
    
          if (params) {
            this.loadData()
    
            this.snakbar.open('User deleted successfully.', 'Dismise', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          }
        });

      }
      else {
        Swal.fire(
          'Cancelled',
          'Your User is safe :)',
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
  checkboxLabel(row?: User): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }


  onAdd() {
    const dialogRef = this.dialog.open(UserdetailComponent, {
      width: '650px',
      //data: { id: 0, sectionID: this.sectionID }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result)
      this.loadData()
      this.snakbar.open('User created successfully.', 'Dismise', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    });
  }

  onEdit(user: User) {
    console.log("Calling edit answer list");
    console.log(user);

    const dialogRef = this.dialog.open(UserdetailComponent, {
      width: '650px',
      data: { user: user }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result)
      this.loadData()
      this.snakbar.open('User Updated successfully.', 'Dismise', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    });
  }
   
}
