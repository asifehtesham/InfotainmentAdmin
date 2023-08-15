import { Component, OnInit, ViewChild, ElementRef, Input, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from 'src/app/services/menu.service'; 
import { MenuNavbar } from 'src/app/models/MenuNavbar'; 
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule} from '@angular/material/tree';
 
import { MenulistComponent } from 'src/app/mainapp/menulist/menulist.component';

interface MenuNode {
  title: string;
  children?: MenuNode[];
  parentId?:any;
  slug?:string;
  isPublish?:boolean;
  id:number;
  createDate?:any;
  lastEditBy?:any;
  lastEditDate?:any;
  createdBy?:number;
  isActive?:boolean;
  parent?:null;
}

interface ExampleFlatNode {
  expandable: boolean;
  title: string;
  level: number;
  id:number;
  children:any;
}
@Component({
  selector: 'app-menudetail',
  templateUrl: './menudetail.component.html',
  styleUrls: ['./menudetail.component.scss']
})
export class MenudetailComponent {
  
  id: number;
  TREE_DATA: MenuNode[]=[];
  
  cateId:number;
  menu:MenuNavbar;
  constructor(private route: ActivatedRoute, 
    private menuService:MenuService, 
    private dialog: MatDialog,
    public dialogRef:MatDialogRef<MenulistComponent>,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    request?this.id=request.id:null
  }

  mapMenu(data: MenuNavbar){
    var node: MenuNode = {
      id: data.id,
      title: data.title,
      children: data.children.map(x=>this.mapMenu(x)),
      parentId: data.parentId
    };
    return node;
  }
  loadTreeData(){
    this.menuService.loadTree().subscribe(results => {
      this.TREE_DATA = results.map(x=>this.mapMenu(x));
      this.dataSource.data = this.TREE_DATA;
    });
    
  }

  ngOnInit(){
    this.loadTreeData()
  }
 
  private _transformer = (node: MenuNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      title: node.title,
      level: level,
      id: node.id,
      children: node.children,
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

  MoveToParent(id, title){
     var data = {
       id:id,
       title:title
     }
    this.dialogRef.close(data);
  }
}