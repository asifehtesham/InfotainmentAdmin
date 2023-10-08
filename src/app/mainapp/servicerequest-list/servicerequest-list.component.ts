import { Component, OnInit, ViewChild } from '@angular/core';
//import { MatPaginator, MatTableDataSource, MatSortable, MatSortHeader, MatSort, MatFormFieldControl, MatInputModule,MatDatepickerInputEvent, MatSlideToggleChange } from "@angular/material";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, timer, interval, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

import { ServiceStatus, Servicerequest } from 'src/app/models/Servicerequest';
import { ServicerequestService } from 'src/app/services/servicerequest.service';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { ServicerequestDetailComponent } from '../servicerequest-detail/servicerequest-detail.component'

import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from "sweetalert2"; 
import { RoomServiceService } from 'src/app/services/roomService.service';

@Component({
  selector: 'app-servicerequest-list',
  templateUrl: './servicerequest-list.component.html',
  styleUrls: ['./servicerequest-list.component.scss']
})

export class ServicerequestListComponent {
  ServiceStatus = ServiceStatus;
  subscription: Subscription;
  displayedColumns: string[] = ['select',
    'patientId',
    'serviceId',
    'roomNo',
    'status',
    'id',
  ];
  servicerequest = [];
  showFilter:boolean=false
  search = new FormControl();
  index: number = 1;
  limit: number = 10;
  pageNumber = 0;
  pageSize = 10;

  paginatedServices: any = [];

  filteredData:any
  services:any
  public loadEmptyMsg: boolean = false;
  public dataSource = new MatTableDataSource<Servicerequest>();
  selection = new SelectionModel<Servicerequest>(true, []);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortable: MatSort;

  constructor(private roomService:RoomServiceService, private http: HttpClient, private servicerequestService: ServicerequestService, private dialog: MatDialog, private snakbar: MatSnackBar) { }

  ngOnInit() {
    this.loadData();
    this.loadServiceData()
  }
  
  loadData() {
    this.servicerequestService.loadData(this.index, this.limit).subscribe(results => {
      this.paginatedServices=results 
      this.dataSource.data = results;
      console.log("results",results)
      this.getData({ pageIndex: this.pageNumber, pageSize: this.pageSize });

    });
  }
  getData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;

    this.filteredData = this.paginatedServices.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
  }
  loadServiceData() {
    this.roomService.loadData(this.index, this.limit).subscribe(results => {
      this.services=results
    });
  }

  searchRoom(searchText): any {
    if (searchText) {
      this.filteredData = this.dataSource.data.filter(room => room.roomNo.toLowerCase().includes(searchText.toLowerCase()));
    } else {
      this.filteredData = this.dataSource.data;
    }
  }

  reqStatus(value) {
    if (value) {
      // console.log(value,this.dataSource.data)
      this.filteredData = this.dataSource.data.filter(room => room.status==value);
    } else {
      this.filteredData = this.dataSource.data;      
    }
  }

  filterService(value){
    if (value) {
      this.filteredData = this.dataSource.data.filter(room => room.serviceId==value);
    } else {
      this.filteredData = this.dataSource.data;      
    }
  }
   
  pages(event) {
    this.index = event.pageIndex + 1;
    this.limit = event.pageSize;

    this.loadData();
  }
  
  chkActive_changed(ambulance: any, $event: MatSlideToggleChange) {

    console.log("chkActive_changed: " + ambulance.id);
    console.log($event.checked);

    ambulance.IsActive = $event.checked;
    this.servicerequestService.editactive(ambulance).subscribe();

  }

  ondelete(servicerequest: Servicerequest) {

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

        this.servicerequestService.delete(servicerequest.id).subscribe(params => {

          this.snakbar.open('Request has been deleted successfully.', 'Dismise', {
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
          'Your Service Request is safe.',
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
          this.servicerequestService.deleteAll(ids).subscribe(result => {
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

  checkboxLabel(row?: Servicerequest): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  onAdd() {
    const dialogRef = this.dialog.open(ServicerequestDetailComponent, {
      width: '750px',
      data: { data: 0 }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      this.loadData();
    });
  }

  onEdit(data: Servicerequest) {
    const dialogRef = this.dialog.open(ServicerequestDetailComponent, {
      width: '750px',
      data: { data: data }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result)
      this.loadData();
    });
  }

  updateStatus(s,e){

    let element = e;
    element.status = s;
    
    this.servicerequestService.update(element).subscribe(result => {
      if (result) {
        this.loadData();
        this.snakbar.open('Your status has been updated successfully.', 'Ok', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }

    });


  }
}
