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

import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";

import { NewversionComponent } from "../newversion/newversion.component";

import { TemplatesService } from "src/app/services/templates.service";

import Swal from "sweetalert2";

import { Router } from "@angular/router";
import { PagedetailComponent } from "../pagedetail/pagedetail.component";

import { TemplatedetailComponent } from "../templatedetail/templatedetail.component";
import { Templates } from "src/app/models/Templates";
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: "app-pageTemplatelist",
  templateUrl: "./pageTemplatelist.component.html",
  styleUrls: ["./pageTemplatelist.component.scss"],
})
export class pageTemplatelist {
  subscription: Subscription;
  displayedColumns: string[] = [
    "select",
    "title",
    "slug",
    "LastEditDate",
    // "isPublish",
    "Design",
    "ID",
  ];
  page = [];
  search = new FormControl();
  public loadEmptyMsg: boolean = false;
  public dataSource = new MatTableDataSource<Templates>();
  selection = new SelectionModel<Templates>(true, []);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortable: MatSort;

  constructor(
    private router: Router,
    private http: HttpClient,
    private pageService: PagesService,
    private templateService: TemplatesService,
    private dialog: MatDialog,
    private snakbar: MatSnackBar,
  ) {}

  loadData() {
    this.templateService.loadData().subscribe((results) => {
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
        this.templateService.delete(id).subscribe((result) => {
          if (result) {
            Swal.fire({
              title: "Congractulations!",
              text: "Your record has been deleted successfully.",
              icon: "success",
            });
          }

          this.loadData();
        });
      } else {
        Swal.fire({
          title: "Congractulations!",
          text: "Your record is now save.",
          icon: "success",
        });
      }
    });
  }

  onRemoveAll() {}
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
  checkboxLabel(row?: Templates): string {
    if (!row) {
      return `${this.isAllSelected() ? "deselect" : "select"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
      row.id + 1
    }`;
  }

  onAdd() {
    const dialogRef = this.dialog.open(TemplatedetailComponent, {
      width: "650px",
      //data: { id: 0, sectionID: this.sectionID }
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
    });
  }

  onEdit(temp: Templates) {
    console.log("page+++", temp);
    const dialogRef = this.dialog.open(TemplatedetailComponent, {
      width: "650px",
      data: { temp: temp },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
    });
  }

  onEditDesign(slug: string) {
    // return this.router.navigate(["/mainapp/design/template", slug]);
  
    window.location.href = "/mainapp/design/template/" + slug;
  }

  changeVersion(version, pageId) {
    console.log("version", version);

    this.pageService.changePageVersion(version, pageId).subscribe((results) => {
      Swal.fire({
        title: "Congractulations!",
        text: "Your version has been updated successfully.",
        icon: "success",
      });

      this.loadData();
    });
  }


  
  // publishVersion(id) {
  //   console.log("id=========",id);
  //  this.templateService.publishTemplate(id)
  //     .subscribe((results) => {
  //       this.snakbar.open('Your template has been published successfully.', 'Ok', {
  //         duration: 2000,
  //       });
  //       this.loadData();
  //     });
  // }


  newVersion(id) {
    const dialogRef = this.dialog.open(NewversionComponent, {
      width: "650px",
      data: { pageId: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
    });
  }

  reload() {}
}
