import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, timer, interval, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators'; 
import { RoomType } from 'src/app/models/RoomType';
import { UserService } from 'src/app/services/user.service';
import { RoomTypeService } from 'src/app/services/roomType.service';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { RoomTypeDetailComponent } from '../room-typedetail/room-typedetail.component'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from "sweetalert2";

@Component({
  selector: 'app-roomtypelist',
  templateUrl: './roomtypelist.component.html',
  styleUrls: ['./roomtypelist.component.scss']
})
export class RoomTypeListComponent {

  subscription: Subscription;

  displayedColumns: string[] = ['select',
    'title',
    'fontType',
    'showFirstMenu',
    'showSecondMenu',
    'id'];
  roomType = [];
  Ids:any=[]

  public dataSource:any = new MatTableDataSource<RoomType>();
  selection = new SelectionModel<RoomType>(true, []);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortable: MatSort;

  constructor(
    private snakbar: MatSnackBar,
    private http: HttpClient, 
    private roomTypeService: RoomTypeService, 
    private dialog: MatDialog) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sortable;
    this.loadData()
  }
 
  loadData() {
    this.roomTypeService.loadData().subscribe(results => {
      this.dataSource.data = results;
    });
  }

  ondelete(roomType: RoomType) {
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
        this.roomTypeService.delete(roomType.id).subscribe(params => {
          console.log('come to the subscriber: ');
          console.log(params);
    
          if (params) {
            this.snakbar.open('Room Type has been deleted successfully.', 'Dismise', {
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
          'Your Room Type is safe :)',
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
          this.roomTypeService.deleteAll(IdsforDelete).subscribe(params => {
            console.log('come to the subscriber: ');
            this.loadData()
          })
        }
        else{
          Swal.fire(
            'Cancelled',
            'Your Room Type is safe',
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

  checkboxLabel(row?: RoomType): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  onAdd() {
    const dialogRef = this.dialog.open(RoomTypeDetailComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result)
      if(result)
      this.loadData()
      

    });
  }

  onEdit(roomType: RoomType) {
    const dialogRef = this.dialog.open(RoomTypeDetailComponent, { 
      width: '650px',
      data: { roomType: roomType }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result)
      this.loadData()
    });
  }
}
