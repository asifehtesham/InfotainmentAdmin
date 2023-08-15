import { Component, OnInit, ViewChild } from '@angular/core';
//import { MatPaginator, MatTableDataSource, MatSortable, MatSortHeader, MatSort, MatFormFieldControl, MatInputModule,MatDatepickerInputEvent, MatSlideToggleChange } from "@angular/material";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, timer, interval, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

import { Page } from 'src/app/models/Page';
import { PageContent } from 'src/app/models/PageContent';


import { PagesService } from 'src/app/services/pages.service';

import { ComponentService } from 'src/app/services/components.service';

import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
//import { PagedetailComponent } from '../pagedetail/pagedetail.component';

import { componentDetail } from '../../componentdetail/componentdetail.component';

import { Router } from '@angular/router';
import { PageComponent } from 'src/app/models/PageComponent';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pagelist',
  templateUrl: './Index.component.html',
  styleUrls: ['./Index.component.scss']
})
export class Index {


  subscription: Subscription;
  displayedColumns: string[] = ['select',
    'title',
    'slug',
    'LastEditDate',
    // 'isPublish',
    'Design', 
    'id'];
  page = [];
  search = new FormControl();
  public loadEmptyMsg: boolean = false;
  public dataSource = new MatTableDataSource<PageComponent>();
  selection = new SelectionModel<PageComponent>(true, []);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortable: MatSort;

  constructor(private router: Router,private http: HttpClient, private pageService: PagesService, private componentService: ComponentService, private dialog: MatDialog,
  private snakbar: MatSnackBar
    ) { }



  loadData(){
    
    this.componentService.loadData().subscribe(results => {

      console.log("results....",results);

      
      this.loadEmptyMsg = true;
      console.log('come to the subscriber');
      this.dataSource.data = results;
    });
  }
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sortable;

    this.loadData();



    this.search.valueChanges.subscribe(
      value => {
        if (value.length == 0) {
          this.componentService.loadData().pipe(map((results => {
            //return results;
            this.dataSource.data = results;
          })));

          return;
        }

        this.componentService.search(value).subscribe(results => {
          //this.loadEmptyMsg = true;
          console.log('come to the subscriber');
          this.dataSource.data = results;
          return results;
        });
      });

  }


  chkActive_changed(ambulance: any, $event: MatSlideToggleChange) {

    console.log("chkActive_changed: " + ambulance.id);
    console.log($event.checked);

    ambulance.IsActive = $event.checked;
    this.pageService.editactive(ambulance).subscribe();

  }


  ondelete(id: number) {


    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to delete this?",
      icon: "warning",
      showConfirmButton: true,
      showCancelButton: true     
    })
    .then((willDelete) => {
      if(willDelete.isConfirmed){
          this.componentService.delete(id).subscribe(result => {  
            if(result){
              // Swal.fire({
              //   title: "Congractulations!",
              //   text: "Your record has been deleted successfully.",
              //   icon: "success", 
              // })

              this.snakbar.open('Congractulations! Your record has been deleted successfully.', 'Ok', {
                duration: 2000,
              });
        

              this.loadData();
            }
          });
      }else{
        // Swal.fire({
        //   title: "Congractulations!",
        //   text: "Your record is now save.",
        //   icon: "success", 
        // })

        this.snakbar.open('Congractulations! Your record is now save.', 'Ok', {
          duration: 2000,
        });
  
        
      }
    });



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
  checkboxLabel(row?: PageContent): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.ID + 1}`;
  }


  onAdd() {
    const dialogRef = this.dialog.open(componentDetail, {
      width: '650px',
      //data: { id: 0, sectionID: this.sectionID }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    
    });
  }

  onEdit(data) {
    const dialogRef = this.dialog.open(componentDetail, {
      width: '650px',
      data: { data: data}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  

  onEditDesign(slug: string) {
    // return this.router.navigate(['/mainapp/design/component',slug]);

    
    window.location.href = "/mainapp/design/component/" + slug;

  }



  // publishVersion(id) {
  //   console.log("id=========",id);
  //  this.componentService.publishComponent(id)
  //     .subscribe((results) => {
  //       this.snakbar.open('Your component has been published successfully.', 'Ok', {
  //         duration: 2000,
  //       });
  //       this.loadData();
  //     });
  // }


  reload() { }
}
