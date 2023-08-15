import { Component, OnInit, ViewChild } from "@angular/core";
//import { MatPaginator, MatTableDataSource, MatSortable, MatSortHeader, MatSort, MatFormFieldControl, MatInputModule,MatDatepickerInputEvent, MatSlideToggleChange } from "@angular/material";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import {
  BehaviorSubject,
  Observable,
  timer,
  interval,
  Subscription,
} from "rxjs";
import { environment } from "src/environments/environment";
import { map, catchError } from "rxjs/operators";

import { Page } from "src/app/models/Page";
import { PagesService } from "src/app/services/pages.service";

import { FormControl } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { SelectionModel } from "@angular/cdk/collections";
import { MatDialog } from "@angular/material/dialog";

import { PageNewversionComponent } from "../page-newversion/page-newversion.component";
import { NewversionComponent } from "../newversion/newversion.component";

import Swal from "sweetalert2";

import { Router } from "@angular/router";
import { PagedetailComponent } from "../pagedetail/pagedetail.component";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: "app-pagelist",
  templateUrl: "./pagelist.component.html",
  styleUrls: ["./pagelist.component.scss"],
})
export class PagelistComponent {
  subscription: Subscription;
  displayedColumns: string[] = [
    "select",
    "title",
    "slug",
    "availableVersion",
    "publishVersion",
    "LastEditDate",
    "isPublish",
    // "Design",
    "ID",
  ];
  page = [];
  search = new FormControl();
  public loadEmptyMsg: boolean = false;
  public dataSource = new MatTableDataSource<Page>();
  selection = new SelectionModel<Page>(true, []);
  pageBaseUrl = 'http://10.201.204.180:9203/pages/'
  


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortable: MatSort;

  constructor(
    private router: Router,
    private http: HttpClient,
    private pageService: PagesService,
    private dialog: MatDialog,
    private snakbar: MatSnackBar
  ) { }

  loadData() {
    this.pageService.loadData().subscribe((results) => {
      this.loadEmptyMsg = true;
      console.log("come to the subscriber");
      this.dataSource.data = results;
    });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sortable;

    this.loadData();

    this.search.valueChanges.subscribe((value) => {
      if (value.length == 0) {
        this.pageService.loadData().pipe(
          map((results) => {
            //return results;

            console.log("results", results);
            this.dataSource.data = results;
          })
        );

        return;
      }

      this.pageService.search(value).subscribe((results) => {
        //this.loadEmptyMsg = true;
        console.log("come to the subscriber");
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
      showCancelButton: true,
    }).then((willDelete) => {
      if (willDelete.isConfirmed) {
        this.pageService.delete(id).subscribe((result) => {
          if (result) {


            this.snakbar.open('Your record has been deleted successfully.', 'Ok', {
              duration: 2000,
            });

            this.loadData();
          }
        });
      } else {


        this.snakbar.open('Congractulations! Your record is now save.', 'Ok', {
          duration: 2000,
        });

      }
    });
  }

  onRemoveAll() { }
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
  checkboxLabel(row?: Page): string {
    if (!row) {
      return `${this.isAllSelected() ? "deselect" : "select"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${row.id + 1
      }`;
  }

  onAdd() {
    const dialogRef = this.dialog.open(PagedetailComponent, {
      width: "650px",
      //data: { id: 0, sectionID: this.sectionID }
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
    });
  }

  onEdit(page: Page) {
    console.log("page+++", page);
    const dialogRef = this.dialog.open(PagedetailComponent, {
      width: "650px",
      data: { page: page },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
    });
  }

  onEditDesign(slug: string) {


    window.location.href = "/mainapp/design/page/" + slug;


  //  // return this.router.navigate(["/mainapp/design/page", slug]);
  }




  changeVersion(version, pageId) {
    this.pageService.changePageVersion(version.value, pageId).subscribe((results) => {
      this.snakbar.open('Your version has been updated successfully.', 'Ok', {
        duration: 2000,
      });
      this.loadData();
    });
  }

  publishVersion(id, currentVersion) {

    this.pageService
      .publishPageVersion(currentVersion, id)
      .subscribe((results) => {

        this.snakbar.open('Your version has been published successfully.', 'Ok', {
          duration: 2000,
        });

        this.loadData();
      });
  }

  unpublishVersion(id) {

    this.pageService.unpublishPageVersion(id).subscribe((results) => {
      this.snakbar.open('Your version has been unpublished successfully.', 'Ok', {
        duration: 2000,
      });
      this.loadData();
    });
  }

  newVersion(element) {
    const dialogRef = this.dialog.open(PageNewversionComponent, {
      width: "650px",
      data: { pageId: element.id, AvailableVersion: element.availableVersion },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      this.loadData();
    });
  }

  reload() { }
}
