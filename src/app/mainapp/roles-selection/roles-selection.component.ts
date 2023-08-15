import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, timer, interval, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

import { Roles } from 'src/app/models/Roles';
import { RoleService } from 'src/app/services/role.service';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-roles-selection',
  templateUrl: './roles-selection.component.html',
  styleUrls: ['./roles-selection.component.scss']
})
export class RolesSelectionComponent {
  subscription: Subscription;
  displayedColumns: string[] = ['select',
    'title',
    //  'id'
  ];
  role = [];
  search = new FormControl();
  public loadEmptyMsg: boolean = false;
  public dataSource = new MatTableDataSource<Roles>();
  selection = new SelectionModel<Roles>(true, []);

  @Input() selectedRoles: Array<Roles>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortable: MatSort;

  constructor(private http: HttpClient, private roleService: RoleService, private dialog: MatDialog) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sortable;
    this.roleService.loadData().subscribe(results => {
      this.loadEmptyMsg = true;
      console.log('come to the subscriber');
      this.dataSource.data = results;
    });


    this.search.valueChanges.subscribe(
      value => {
        if (value.length == 0) {
          this.roleService.loadData().pipe(map((results => {
            //return results;
            this.dataSource.data = results;
          })));

          return;
        }

        this.roleService.search(value).subscribe(results => {
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
    this.roleService.editactive(ambulance).subscribe();

  }

  ondelete(ambulance: any) {

    console.log("delete: " + ambulance.id);
    //console.log($event.checked);

    //ambulance.IsActive = $event.checked;
    this.roleService.delete(ambulance.id).subscribe(params => {
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
  checkboxLabel(row?: Roles): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }


  reload() { }
}
