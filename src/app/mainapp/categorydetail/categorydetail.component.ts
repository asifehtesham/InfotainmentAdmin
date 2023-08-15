import { Component, OnInit, ViewChild, ElementRef, Input, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service'; 
import { Category } from 'src/app/models/Category'; 
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule} from '@angular/material/tree';
 
import { CategorylistComponent } from 'src/app/mainapp/categorylist/categorylist.component';

interface CategoryNode {
  title: string;
  children?: CategoryNode[];
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
  selector: 'app-categorydetail',
  templateUrl: './categorydetail.component.html',
  styleUrls: ['./categorydetail.component.scss']
})
export class CategorydetailComponent {
  
  id: number;
  TREE_DATA: CategoryNode[]=[];
  
  cateId:number;
  category:Category;
  constructor(private route: ActivatedRoute, 
    private categoryService:CategoryService, 
    private dialog: MatDialog,
    public dialogRef:MatDialogRef<CategorylistComponent>,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    request?this.id=request.id:null
  }

  mapCategory(data: Category){
    var node: CategoryNode = {
      id: data.id,
      title: data.title,
      children: data.children.map(x=>this.mapCategory(x)),
      parentId: data.parentId
    };
    // console.log("node",node)
    return node;
  }
  loadTreeData(){
    this.categoryService.loadTree().subscribe(results => {
      this.TREE_DATA = results.map(x=>this.mapCategory(x));
      this.dataSource.data = this.TREE_DATA;
    });
    
  }

  ngOnInit(){
    this.loadTreeData()
  }
 
  private _transformer = (node: CategoryNode, level: number) => {
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

  MoveToParent(id,title){
     var data = {
       id:id,
       title:title
     }
    this.dialogRef.close(data);
  }
}