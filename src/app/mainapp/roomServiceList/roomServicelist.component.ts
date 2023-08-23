
import { Component, OnInit, ViewChild } from '@angular/core';
//import { MatPaginator, MatTableDataSource, MatSortable, MatSortHeader, MatSort, MatFormFieldControl, MatInputModule,MatDatepickerInputEvent, MatSlideToggleChange } from "@angular/material";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, timer, interval, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

import { RoomService } from 'src/app/models/RoomService';
import { RoomServiceService } from 'src/app/services/roomService.service';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { RoomServicedetailComponent } from '../roomServiceDetail/roomServicedetail.component';

import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from "sweetalert2";





@Component({
  selector: 'app-roomServicelist',
  templateUrl: './roomServicelist.component.html',
  styleUrls: ['./roomServicelist.component.scss']
})
export class RoomServicelistComponent {



  subscription: Subscription;
  displayedColumns: string[] = ['select',
    'title',
    'titleAr',
    'lastEditDate',
    'isPublish',
    'id'];
  roomService = [];
  search = new FormControl();
  index: number = 1;
  limit: number = 10;
  pageTotal: number = 20;

  public loadEmptyMsg: boolean = false;
  public dataSource = new MatTableDataSource<RoomService>();
  selection = new SelectionModel<RoomService>(true, []);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortable: MatSort;

  constructor(private http: HttpClient, private roomServiceService: RoomServiceService, private dialog: MatDialog, private snakbar: MatSnackBar) { }

  ngOnInit() {
    this.loadData();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sortable;
    this.loadData();


    this.search.valueChanges.subscribe(
      value => {
        if (value.length == 0) {
          this.roomServiceService.loadData().pipe(map((results => {
            //return results;
            this.dataSource.data = results;
          })));

          return;
        }

        this.roomServiceService.search(value).subscribe(results => {
          //this.loadEmptyMsg = true;
          console.log('come to the subscriber');
          this.dataSource.data = results;
          return results;
        });
      });

  }

  loadData() {
    this.roomServiceService.loadData(this.index, this.limit).subscribe(results => {
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
    // this.formService.loadData(this.index, this.limit).pipe(map((results => {
    //   this.dataSource.data = results;
    // })));
  }
  chkActive_changed(ambulance: any, $event: MatSlideToggleChange) {

    console.log("chkActive_changed: " + ambulance.id);
    console.log($event.checked);

    ambulance.IsActive = $event.checked;
    this.roomServiceService.editactive(ambulance).subscribe();

  }






  ondelete(roomService: any) {

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

        this.roomServiceService.delete(roomService.id).subscribe(params => {

          this.snakbar.open('Record has been deleted successfully.', 'Dismise', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });

          this.loadData();
        });
      }
      else {
        Swal.fire(
          'Cancelled',
          'Your RoomService is safe :)',
          'error'
        )
      }
    })
  }



  onRemoveAll() {
    if (this.selection.selected.length <= 0) {
      this.snakbar.open('Select one or more record to perform this action.', 'Ok', {
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
          this.roomServiceService.deleteAll(ids).subscribe(result => {
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
  checkboxLabel(row?: RoomService): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }


  onAdd() {

    console.log("onAdd() ........... trigger");

    const dialogRef = this.dialog.open(RoomServicedetailComponent, {
      width: '650px',
      data: { id: 0 }
    });
    dialogRef.afterClosed().subscribe(result => {

      // this.snakbar.open('RoomService has been created successfully.', 'Dismise', {
      //   duration: 3000,
      //   horizontalPosition: 'right',
      //   verticalPosition: 'top',
      // });

      this.loadData();
    });
  }

  onEdit(data: any) {
    const dialogRef = this.dialog.open(RoomServicedetailComponent, {
      width: '650px',
      data: { id: data.id, roomService: data }
    });
    dialogRef.afterClosed().subscribe(result => {

      // this.snakbar.open('RoomService has been updated successfully.', 'Dismise', {
      //   duration: 3000,
      //   horizontalPosition: 'right',
      //   verticalPosition: 'top',
      // });

      this.loadData();

    });
  }
  reload() { }
}
