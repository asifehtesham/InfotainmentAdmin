
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, timer, interval, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Banner } from 'src/app/models/Banner';
import { BannerService } from 'src/app/services/banner.service';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { BannerdetailComponent } from '../bannerdetail/bannerdetail.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-bannerlist',
  templateUrl: './bannerlist.component.html',
  styleUrls: ['./bannerlist.component.scss']
})
export class BannerlistComponent implements OnInit, AfterViewInit {

  subscription: Subscription;
  displayedColumns: string[] = ['select',
    'title',
    //'link',
    'linkText',
    'availableStartDate',
    'availableEndDate',
    'isFeatured',
    'lastEditDate',
    'isPublish',
    'id'];
  banner = [];
  search = new FormControl();
  public loadEmptyMsg: boolean = false;
  public dataSource = new MatTableDataSource<Banner>();
  selection = new SelectionModel<Banner>(true, []);

  index: number = 1;
  limit: number = 10;
  pageTotal: number = 20;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortable: MatSort;

  constructor(private http: HttpClient, private bannerService: BannerService, private dialog: MatDialog,
    private route: ActivatedRoute,
    private snakbar: MatSnackBar,

    private router: Router) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sortable;
    this.bannerService.loadData(this.index, this.limit).subscribe(results => {
      this.loadEmptyMsg = true;
      console.log('come to the subscriber');
      this.dataSource.data = results;
    });


    this.search.valueChanges.subscribe(
      value => {
        if (value.length == 0) {
          this.bannerService.loadData(this.index, this.limit).pipe(map((results => {
            //return results;
            this.dataSource.data = results;
          })));

          return;
        }

        this.bannerService.search(value).subscribe(results => {
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

    this.bannerService.loadData(this.index, this.limit).subscribe(results => {
      this.loadEmptyMsg = true;
      console.log('come to the subscriber');
      this.dataSource.data = results;
    });
    // this.bannerService.loadData(this.index, this.limit).pipe(map((results => {
    //   this.dataSource.data = results;
    // })));
  }
  is_Visible(banner: any, $event: MatSlideToggleChange) {

    console.log("chkActive_changed: " + banner.id);
    console.log($event.checked);

    banner.isPublish = $event.checked;
    this.bannerService.change_Visible(banner).subscribe(result=>{
      var visible =''
      if(result.isPublish){
        visible = 'Visible'
      }
      else{
        visible = 'Not Visible'
        
      }
      this.snakbar.open(result.title+' is '+visible+' now.', 'Dismise', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    });

  }

  ondelete(ambulance: any) {

    console.log("delete: " + ambulance.id);
    //console.log($event.checked);

    //ambulance.IsActive = $event.checked;
    this.bannerService.delete(ambulance.id).subscribe(params => {
      console.log('come to the subscriber: ');
      console.log(params);

      if (params) {
        const index: number = this.dataSource.data.indexOf(ambulance);
        if (index !== -1) {
          this.dataSource.data.splice(index, 1);
        }
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
  
  onAdd() {
    const dialogRef = this.dialog.open(BannerdetailComponent, {
      width: '650px',
      //data: { id: 0, sectionID: this.sectionID }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }

  onEdit(data: any) {
    console.log("Calling edit answer list");
    console.log(data);

    const dialogRef = this.dialog.open(BannerdetailComponent, {
      width: '650px',
      data: { id: data.id, banner: data }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  reload() { }
}
