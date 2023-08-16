import { Component,Injectable, OnInit, ViewChild , Output, Inject, EventEmitter} from '@angular/core';
import { BehaviorSubject, Observable,of, timer, interval, Subscription } from 'rxjs';
import { FormControl, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Category } from 'src/app/models/Category';
import { CategoryService } from 'src/app/services/category.service';
import { MatDialog,MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule} from '@angular/material/tree';
import Swal from "sweetalert2"; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategorydetailComponent } from '../categorydetail/categorydetail.component'

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
/**
 * @title Tree with flat nodes
 */
@Component({
  selector: 'app-categorylist',
  templateUrl: './categorylist.component.html',
  styleUrls: ['./categorylist.component.scss']
})

export class CategorylistComponent {
  TREE_DATA: CategoryNode[]=[];
  
  categoryForm: FormGroup;
  id: number; 
  cateId:number;
  category:Category;

  constructor(private snakbar: MatSnackBar,private categoryService: CategoryService,private fb: FormBuilder,private dialog: MatDialog) {}
 
  mapCategory(data: Category){
    var node: CategoryNode = {
      id: data.id,
      title: data.title,
      children: data.children.map(x=>this.mapCategory(x)),
      parentId: data.parentId
    };
    return node;
  }
  loadTreeData(){
    this.categoryService.loadTree().subscribe(results => {
      this.TREE_DATA = results.map(x=>this.mapCategory(x));
      this.dataSource.data = this.TREE_DATA;
    });
    
  }

  ngOnInit(){
    this.buildForm()
    this.loadTreeData()
  }
 
  private _transformer = (node: CategoryNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      title: node.title,
      level: level,
      id: node.id,
      children:node.children
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
 
  get f() { return this.categoryForm.controls; }
  buildForm() {
    console.log("build form ");
    this.categoryForm = this.fb.group({
      'id': [this.id, [
        //Validators.required
      ]],
      'title': ['', [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(1)
      ]],
      'parentId':null
    });

  }

  delete(){
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

        this.categoryService.delete(id).subscribe(params => {
          console.log('come to the subscriber: ');
          this.loadTreeData();
          this.revert()
    
        });
      }
      else{
        Swal.fire(
          'Cancelled',
          'Your category is safe :)',
          'error'
        )
      }
    })


  }
  observer: Observable<any>;
  
  save(){
    var category: Category = {
      id: this.id,
      title: this.f.title.value,
      parentId: this.cateId?this.cateId:0,
      IsActive: true
    }

    if (category.id == null || category.id <= 0)
      this.observer = this.categoryService.add(category);
    else
      this.observer = this.categoryService.edit(category);

    this.observer.subscribe(result => {
      if(result.id){

        this.loadTreeData()
        this.revert()
        
        this.snakbar.open('Category added successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
         
      }
      console.log("Response from server:");
    });
  }
  selectedId: number = 0;
  revert() {this.categoryForm.reset();this.id=null;this.cateId=null;this.selectedId=0}
  onEdit(id){
    this.revert()
    this.selectedId = id;
    this.id=id
    this.categoryService.loadByID(id).subscribe(results => {
      console.log(results)
      this.category = results;
      this.f.title.setValue(this.category.title);
      this.cateId=this.category.parentId
      

      if(this.category.parentId)

      this.f.parentId.setValue(this.category.parent.title);
      
    });
  }
  onAdd(id){
    this.revert()
    this.cateId= id
    this.selectedId = 0;
    this.categoryService.loadByID(id).subscribe(result => {
      this.f.parentId.setValue(result.title);
    });
  }

  onMove(){
    var id = this.selectedId

    if(id>0){
      const dialogRef = this.dialog.open(CategorydetailComponent, {
        width: '650px',
        data: { id: id}
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if(result){
          this.cateId=result.id
          this.f.parentId.setValue(result.title);
          this.save()
        }
      });
    }
  }
  
}