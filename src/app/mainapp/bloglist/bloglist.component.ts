import { Component, OnInit, ViewChild } from '@angular/core';
//import { MatPaginator, MatTableDataSource, MatSortable, MatSortHeader, MatSort, MatFormFieldControl, MatInputModule,MatDatepickerInputEvent, MatSlideToggleChange } from "@angular/material";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, timer, interval, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Blog } from 'src/app/models/Blog';
import { BlogService } from 'src/app/services/blog.service';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { BlogdetailComponent } from '../blogdetail/blogdetail.component';
import { MatTableDataSource } from '@angular/material/table';
import Swal from "sweetalert2";
import { Router } from "@angular/router";


@Component({
  selector: 'app-bloglist',
  templateUrl: './bloglist.component.html',
  styleUrls: ['./bloglist.component.scss']
})
export class BloglistComponent {
  
  subscription: Subscription;
  displayedColumns: string[] = ['select',
    'title',
    'slug',
    'categoryId',
    'authorId',
    // 'availableStartDate',
    // 'availableEndDate',
    'LastEditDate',
    'isFeatured',
    'canComment',
    'isPublish',
    //'IsActive', 
    'ID'];
  blog = [];
  Ids=[]
  search = new FormControl();
  public loadEmptyMsg: boolean = false;
  public dataSource = new MatTableDataSource<Blog>();
  selection = new SelectionModel<Blog>(true, []);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortable: MatSort;

  constructor(private http: HttpClient, private blogService: BlogService,private snakbar: MatSnackBar, private dialog: MatDialog,private router: Router
    ) { }


  loadData(){

    this.blogService.loadData().subscribe(results => {
      this.loadEmptyMsg = true;
      console.log('come to the subscriber');
      this.dataSource.data = results;
    });


    this.search.valueChanges.subscribe(
      value => {
        if (value.length == 0) {
          this.blogService.loadData().pipe(map((results => {
            //return results;
            this.dataSource.data = results;
          })));

          return;
        }

        this.blogService.search(value).subscribe(results => {
          //this.loadEmptyMsg = true;
          console.log('come to the subscriber');
          this.dataSource.data = results;
          return results;
        });
      });
    
  }
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sortable;
    
    this.loadData();
   
  }

  is_published(blog: any, $event: MatSlideToggleChange) {

    console.log("chkActive_changed: " + blog.id);
    console.log($event.checked);

    blog.isPublish = $event.checked;
    this.blogService.publish(blog).subscribe(result => {
  
      var publish =''
      if(result.isPublish){
        publish = 'Published'
      }
      else{
        publish = 'Un Published'
        
      }
      this.snakbar.open(result.title+' has been '+publish+' successfully.', 'Dismise', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
          // Swal.fire({
          //   title: "Congratulations!",
          //   text: "Blog has been "+publish+" successfully",
          //   icon: "success",
          // });
    });

  }

  ondelete(blog: any) {

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
      
        this.blogService.delete(blog.id).subscribe(params => {
          this.loadData()
          console.log('come to the subscriber: ');
        });
      }
      else{
        Swal.fire(
          'Cancelled',
          'Your blog is safe :)',
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
          this.blogService.deleteAll(IdsforDelete).subscribe(params => {
            console.log('come to the subscriber: ');
            this.loadData()
             
          });
          
        }
        else{
          Swal.fire(
            'Cancelled',
            'Your blog is safe :)',
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
      this.Ids=[] 
      return;
    }
    
    this.selection.select(...this.dataSource.data);
    if(this.selection.selected){
  
      this.selection.selected.forEach(element => {
        this.Ids.push(element.id)
      }); 
    }  
  }

  onAdd() {
    const dialogRef = this.dialog.open(BlogdetailComponent, {
      width: '650px',
      //data: { id: 0, sectionID: this.sectionID }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if(result){
        this.loadData()
      }
        console.log('The dialog was closed');

    });
  }

  onEdit(id: number) {

    const dialogRef = this.dialog.open(BlogdetailComponent, {
      width: '650px',
      data: { id: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }





  
  onAdvanceEdit(id: number) {
    return this.router.navigate(["/mainapp/blog/design", id]);
  }




  

  reload() { }
}
