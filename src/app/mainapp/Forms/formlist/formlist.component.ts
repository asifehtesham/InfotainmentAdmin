

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, timer, interval, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

import { Form } from 'src/app/models/Form';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from 'src/app/services/form.service';
import { FormDetailComponent } from '../form-detail/form-detail.component';
import { FormNewversionComponent } from '../form-newversion/form-newversion.component';
import Swal from "sweetalert2";
import { MatSnackBar } from '@angular/material/snack-bar';
import { OpenAIService } from 'src/app/services/openai.service';

@Component({
  selector: 'app-formlist',
  templateUrl: './formlist.component.html',
  styleUrls: ['./formlist.component.scss']
})
export class FormlistComponent implements OnInit, AfterViewInit {

  subscription: Subscription;
  // currentVersion?: string;
  // publishedVersion?: string;
  // availableVersion?: string;
  displayedColumns: string[] = ['select',
    'title',
    //'link',
    'slug',
    'currentVersion',
    'lastEditDate',
    'isPublish',
    'id'];
  form = [];
  search = new FormControl();
  public loadEmptyMsg: boolean = false;
  public dataSource = new MatTableDataSource<Form>();
  selection = new SelectionModel<Form>(true, []);

  index: number = 1;
  limit: number = 10;
  pageTotal: number = 20;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortable: MatSort;

  constructor(private http: HttpClient, private formService: FormService, private dialog: MatDialog,
    private openAIService: OpenAIService,
    private snakbar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sortable;

    this.loadData();

    this.search.valueChanges.subscribe(
      value => {
        if (value.length == 0) {

          this.formService.loadData(this.index, this.limit).pipe(map((results => {
            //return results;
            this.dataSource.data = results;
          })));

          return;
        }

        this.formService.search(value).subscribe(results => {
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

  loadData() {
    this.formService.loadData(this.index, this.limit).subscribe(results => {
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
    this.formService.editactive(ambulance).subscribe();

  }

  ondelete(data: any) {

    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to delete this?",
      icon: "warning",
      showConfirmButton: true,
      showCancelButton: true
    })
      .then((willDelete) => {
        if (willDelete.isConfirmed) {
          this.formService.delete(data.id).subscribe(result => {
            if (result) {
              this.snakbar.open('Your record has been deleted successfully.', 'Ok', {
                duration: 2000,
              });

              if (result) {
                const index: number = this.dataSource.data.indexOf(data);
                if (index !== -1) {
                  this.dataSource.data.splice(index, 1);
                }
              }
            }
          });
        } else {
          this.snakbar.open('Delete action dismissed.', 'Ok', {
            duration: 2000,
          });
        }
      });
    /*
        this.formService.delete(ambulance.id).subscribe(params => {
          console.log('come to the subscriber: ');
          console.log(params);
    
          if (params) {
            const index: number = this.dataSource.data.indexOf(ambulance);
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
            }
          }
        });*/
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
          this.formService.deleteAll(ids).subscribe(result => {
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
  checkboxLabel(row?: Form): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  onChat() {
    // var response = this.openAIService.chat("website page html for about us");
    // console.log(response);

    // var response = this.openAIService.chat("website page html for about us")
    //   .pipe(map(result => {
    //     console.log("result from chat");
    //     console.log(result);
    //   }));
    var response = this.openAIService.chat("write the blog on the saudi foundation day with some picture")
      .subscribe(result => {
        console.log("result from chat");
        console.log(result);
      });

  }

  onAdd() {
    const dialogRef = this.dialog.open(FormDetailComponent, {
      width: '650px',
      //data: { id: 0, sectionID: this.sectionID }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadData();
      this.snakbar.open('Your record has been added successfully.', 'Ok', {
        duration: 2000,
      });
    });
  }

  onEdit(data: any) {
    console.log("Calling edit answer list");
    console.log(data);

    const dialogRef = this.dialog.open(FormDetailComponent, {
      width: '650px',
      data: { id: data.id, form: data }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadData();
      this.snakbar.open('Your record has been updated successfully.', 'Ok', {
        duration: 2000,
      });
    });
  }

  addVersion(form: Form) {
    const dialogRef = this.dialog.open(FormNewversionComponent, {
      width: '650px',

      data: { id: form.id, AvailableVersion: form.availableVersion }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadData();
      this.snakbar.open('New version added successfully.', 'Ok', {
        duration: 2000,
      });
    });
  }
  currentVersionChange(event, form: Form) {

    console.log("currentVersionChange");
    console.log(event);
    console.log(form);

    if (event.value == 0) {
      //opne dialog
      this.addVersion(form);
    }
    else {
      //call api tp change the version
      this.formService.change_version(form.id, event.value).subscribe(params => {
        console.log('come to the subscriber: ');
        console.log(params);
        this.loadData();
        this.snakbar.open('Selected version has been changed.', 'Ok', {
          duration: 2000,
        });
      });
    }

  }
  reload() { }
}
