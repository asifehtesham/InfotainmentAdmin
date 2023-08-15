import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, timer, interval, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Service } from 'src/app/models/Service';
import { ServiceService } from 'src/app/services/service.service';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { ServicedetailComponent } from '../servicedetail/servicedetail.component';
import Swal from "sweetalert2";


@Component({
  selector: 'app-servicelist',
  templateUrl: './servicelist.component.html',
  styleUrls: ['./servicelist.component.scss']
})

export class ServicelistComponent {
  subscription: Subscription;
  displayedColumns: string[] = [
    'select',
    'title',
    'content',
    'availableStartDate',
    'availableEndDate',
    'isPublish',
    'ID'
  ];

  service = [];
  search = new FormControl();
  public loadEmptyMsg: boolean = false;
  public dataSource = new MatTableDataSource<Service>();
  selection = new SelectionModel<Service>(true, []);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortable: MatSort;

  constructor(private http: HttpClient, private serviceService: ServiceService, private dialog: MatDialog) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sortable;
    this.loadData()
  }

  loadData() {
    this.serviceService.loadData().subscribe(results => {
      this.loadEmptyMsg = true;
      console.log('come to the subscriber');
      this.dataSource.data = results;
    });

    this.search.valueChanges.subscribe(
      value => {
        if (value.length == 0) {
          this.serviceService.loadData().pipe(map((results => {
            //return results;
            this.dataSource.data = results;
          })));

        return;
      }

      this.serviceService.search(value).subscribe(results => {
        //this.loadEmptyMsg = true;
        console.log('come to the subscriber');
        this.dataSource.data = results;
        return results;
      });
    });
  }
  chkActive_changed(service: any, $event: MatSlideToggleChange) {

    console.log("chkActive_changed: " + service.id);
    console.log($event.checked);

    service.IsActive = $event.checked;
    this.serviceService.editactive(service).subscribe();

  }
  ondelete(service: Service) {
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
        this.serviceService.delete(service.id).subscribe(params => {
          
          console.log(params);
          if(params) {
            this.loadData();
          }
        });
        
      }
      else{
        Swal.fire(
          'Cancelled',
          'Your Service is safe :)',
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
  checkboxLabel(row?: Service): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
  onAdd() {
    const dialogRef = this.dialog.open(ServicedetailComponent, {
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
    const dialogRef = this.dialog.open(ServicedetailComponent, {
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
