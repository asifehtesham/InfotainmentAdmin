import { Component, Injectable, OnInit, ViewChild, Output, Inject, EventEmitter } from '@angular/core';

import { FormControl, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MenuNavbar } from 'src/app/models/MenuNavbar';
import { MenuService } from 'src/app/services/menu.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import Swal from "sweetalert2";
import { MenudetailComponent } from '../menudetail/menudetail.component'
import { SiteLinksService } from 'src/app/services/site_links.service';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
interface MenuNode {
  title: string;
  children?: MenuNode[];
  parentId?: any;
  slug?: string;
  isPublish?: boolean;
  id: number;
  createDate?: any;
  lastEditBy?: any;
  lastEditDate?: any;
  createdBy?: number;
  isActive?: boolean;
  parent?: null;
}

interface ExampleFlatNode {
  expandable: boolean;
  title: string;
  level: number;
  id: number;
  children: any;
}
/**
 * @title Tree with flat nodes
 */
@Component({
  selector: 'app-menulist',
  templateUrl: './menulist.component.html',
  styleUrls: ['./menulist.component.scss']
})

export class MenulistComponent {
  TREE_DATA: MenuNode[] = [];

  menuForm: FormGroup;
  id: number;
  cateId: number;
  menu: MenuNavbar;



  myControl: FormControl = new FormControl();
  options: any;
  filteredOptions: Observable<string[]>;



  constructor(private menuService: MenuService, private fb: FormBuilder, private dialog: MatDialog,
    private siteLinksService: SiteLinksService
  ) { }

  mapMenu(data: MenuNavbar) {
    var node: MenuNode = {
      id: data.id,
      title: data.title,
      children: data.children.map(x => this.mapMenu(x)),
      parentId: data.parentId
    };
    return node;
  }
  loadTreeData() {
    this.menuService.loadTree().subscribe(results => {
      this.TREE_DATA = results.map(x => this.mapMenu(x));
      this.dataSource.data = this.TREE_DATA;
    });

  }



  filter(val: string): string[] {
    return this.options.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  async ngOnInit() {

    await this.siteLinksService.get_links().subscribe(results => {
      let opt = [];
      if (results.data.length > 0) {


        for (let index = 0; index < results.data.length; index++) {
          opt.push(results.data[index].url);
        }
        this.options = opt;


        console.log("this.options", this.options);


      }
    });

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val))
      );


    this.buildForm()
    this.loadTreeData()
  }

  private _transformer = (node: MenuNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      title: node.title,
      level: level,
      id: node.id,
      children: node.children
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );
  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  filterRecursive(filterText: string, array: any[], property: string) {
    let filteredData;

    function copy(o: any) {
      return Object.assign({}, o);
    }

    if (filterText) {
      filterText = filterText.toLowerCase();
      filteredData = array.map(copy).filter(function x(y) {
        if (y[property].toLowerCase().includes(filterText)) {
          return true;
        }
        if (y.children) {
          return (y.children = y.children.map(copy).filter(x)).length;
        }
      });
    } else {
      filteredData = array;
    }
    return filteredData;
  }

  filterTree(filterText: string) {
    this.dataSource.data = this.filterRecursive(filterText, this.TREE_DATA, 'title');
  }

  applyFilter(filterText: string) {
    this.filterTree(filterText);
    if (filterText) {
      this.treeControl.expandAll();
    } else {
      this.treeControl.collapseAll();
    }
  }

  get f() { return this.menuForm.controls; }

  buildForm() {
    console.log("build form ");
    this.menuForm = this.fb.group({
      'id': [this.id, []],
      'title': ['', [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(1)
      ]],
      'parentId': null,
      'url': ['', [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(1)
      ]],
    });

  }

  delete() {
    var id = this.selectedId
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

        this.menuService.delete(id).subscribe(params => {
          console.log('come to the subscriber: ');
          this.loadTreeData();
          this.revert()

        });
      }
      else {
        Swal.fire(
          'Cancelled',
          'Your menu is safe :)',
          'error'
        )
      }
    })


  }
  observer: Observable<any>;

  save() {
    var menu: MenuNavbar = {
      id: this.id,
      title: this.f.title.value,
      parentId: this.cateId ? this.cateId : 0,
      IsActive: true,
      url: this.f.url.value
    }

    if (menu.id == null || menu.id <= 0)
      this.observer = this.menuService.add(menu);
    else
      this.observer = this.menuService.edit(menu);

    this.observer.subscribe(result => {
      if (result.id) {

        this.loadTreeData()
        this.revert()
        Swal.fire(
          'Successfully!',
          'Your Menu has been Created Successfully.',
          'success'
        )
      }
      console.log("Response from server:");
    });
  }

  selectedId: number = 0;
  revert() { this.menuForm.reset(); this.id = null; this.cateId = null; this.selectedId = 0 }

  onEdit(id) {
    this.revert()
    this.selectedId = id;
    this.id = id
    this.menuService.loadByID(id).subscribe(results => {
      this.menu = results;
      this.f.title.setValue(this.menu.title);
      this.f.url.setValue(this.menu.url);
      this.cateId = this.menu.parentId
      if (this.menu.parentId)
        this.f.parentId.setValue(this.menu.parent.title);

    });
  }

  onAdd(id) {
    this.revert()
    this.cateId = id
    this.selectedId = 0;
    this.menuService.loadByID(id).subscribe(result => {
      this.f.parentId.setValue(result.title);
    });
  }

  onMove() {
    var id = this.selectedId

    if (id > 0) {
      const dialogRef = this.dialog.open(MenudetailComponent, {
        width: '650px',
        data: { id: id }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result) {
          this.cateId = result.id
          this.f.parentId.setValue(result.title);
          this.save()
        }
      });
    }
  }
}