import { Component, OnInit, ViewChild, ElementRef, Input, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { SingleFileUploadComponent } from 'src/app/coreui/single-file-upload/single-file-upload.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Blog } from 'src/app/models/Blog';
import { EditorConfig,environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from 'src/app/services/blog.service';
import { TemplatesService } from 'src/app/services/templates.service';
import slugify from 'slugify';
import { Title } from 'chart.js/dist/types';
import { Category } from 'src/app/models/Category';
import { Templates } from 'src/app/models/Templates';
import { Comments } from 'src/app/models/Comments';
import { Attachment } from 'src/app/models/Attachment';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { Router } from "@angular/router";

import { ContentbuilderComponent } from '../content-builder/content-builder.component';

interface CommentNode {
  blogId?: any;
  children?: CommentNode[];
  parentId?: any;
  userId?: any;
  comment?: string;
  id?: number;
  isApproved?: boolean;
  likes?: any;
  dislikes?: any;
  createDate?: any;
  lastEditDate?: any;
  createdBy?: number;
  lastEditBy?: any;
  isActive?: boolean;
  user?:any;
}

interface ExampleFlatNode {
  expandable: boolean;
  comment: string;
  isApproved: boolean;
  likes: number;
  dislikes: number;
  level: number;
  id: number;
  user:any;
  children:any;
}

@Component({
  selector: 'app-blogdetail',
  templateUrl: './blogdetail.component.html',
  styleUrls: ['./blogdetail.component.scss']
})
export class BlogdetailComponent {
  TREE_DATA: CommentNode[];
  myControl = new FormControl('');
  categories: Category[] =[];
  filteredCategories: Observable<string[]>;
  templates:Templates[]=[];
  id: number;
  blog: Blog;
  comments: Comments[];
  blogForm: FormGroup;
  cateId: number;
  url: string = '';
  done: any;
  isBlogSaved: boolean = true;
  components = [
    {
    label:'placeholder 1',
     type : 'placeholder-var',
     value : '{{ SOME_VAR_EXAMPLE_2 }}',
     place_holder : "I'm a placeholder var, check the code"
    },
    {
      label:'placeholder 2',
      type : 'placeholder-var1',
      value : '{{ SOME_VAR_EXAMPLE_21 }}',
      place_holder : "I'm a placeholder var, check the code1"
     },
     {
      label:'placeholder 3',
      type : 'placeholder-var2',
      value : '{{ SOME_VAR_EXAMPLE_2 }}',
      place_holder : "I'm a placeholder var, check the code2"
     }        
  ];

  @ViewChild('imagefile', { static: true }) imagefile: ElementRef;
  @ViewChild('imageControl', { static: false }) imageControl: SingleFileUploadComponent;

  editorConfig: any = EditorConfig;
  isApproved = 0
  contentData: any;

  apiUrl = environment.apiUrl;
 
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private categoryService: CategoryService, private blogService: BlogService, private templatesService: TemplatesService, private snakbar: MatSnackBar, private dialog: MatDialog,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public request: any) {

    request ? this.id = request.id : null
  }

  mapComments(data: Comments){
    //if(data.children)
    var node: CommentNode = {
      id: data.id,
      comment: data.comment,
      isApproved:data.isApproved,
      user:data.user,
      likes:data.likes,
      dislikes:data.dislikes,
      children: data.children.map(x=>this.mapComments(x)),
      parentId: data.parentId
    };
    return node;
  }

  loadTreeData(){
    if(this.id){
      this.blogService.loadTree(this.id).subscribe(results => {
        this.comments = results;
        this.TREE_DATA = this.comments.map(x => this.mapComments(x));

        this.dataSource.data = this.TREE_DATA;
      });

    }
  }

  private _transformer = (node: CommentNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      comment: node.comment,
      isApproved: node.isApproved,
      user:node.user,
      likes:node.likes,
      dislikes:node.dislikes,
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
    this.dataSource.data = this.filterRecursive(filterText, this.TREE_DATA, 'comment');
  }

  applyFilter(filterText: string) {
    this.filterTree(filterText);
    if (filterText) {
      this.treeControl.expandAll();
    } else {
      this.treeControl.collapseAll();
    }
  }

  ngOnInit() {



    

    this.loadTreeData()
    this.filteredCategories = this.myControl.valueChanges.pipe(
      startWith(null),
      map(value => value ? this.catFilters(value) : this.categories.slice())
    );
    this.categoryService.loadData().subscribe(results => {
      results.forEach(element => {
        this.categories.push(element)
      });
    })
    this.templatesService.loadData().subscribe(results => {
      results.forEach(element => {
        this.templates.push(element)
      });
    })
    this.route.params.subscribe(params => {

      this.buildForm();

      if (this.id > 0) {
        this.blogService.loadByID(this.id).subscribe(results => {
          //this.loadEmptyMsg = true;
          this.blog = results;

          this.contentData = this.blog.content

          this.f.slug.setValue(this.blog.slug);
          this.f.title.setValue(this.blog.title);
         // this.f.content.setValue(this.blog.content);
          this.f.authorId.setValue(this.blog.authorId);
          this.f.availableStartDate.setValue(this.blog.availableStartDate);
          this.f.availableEndDate.setValue(this.blog.availableEndDate);
          this.f.isFeatured.setValue(this.blog.isFeatured);
          this.f.canComment.setValue(this.blog.canComment);
          this.f.templateSlug.setValue(this.blog.templateSlug);
          if (this.blog.image)
            this.imageControl.setImage(this.blog.image.data);

        });
      }
    });
  }

  displayFn(categories: Category[]): (title: string) => string {
    return (title: string) => {
      const correspondingOption = Array.isArray(categories) ? categories.find(category => category.title === title) : null;
      const catId = correspondingOption ? correspondingOption.id : ''
      catId ? this.cateId = catId : ''
      return correspondingOption ? correspondingOption.title : '';
    }
  }
  private catFilters(value: string): any {
    if (typeof value == 'string') {
      return this.categories.filter(category => category.title.toString().toLowerCase().includes(value.toLowerCase()));
    } else {
       return this.categories;
    }
  }
  buildForm() {
    this.blogForm = this.fb.group({
      'ID': [this.id, [
        //Validators.required
      ]],
      'slug': ['', [
        Validators.maxLength(5000)
      ]],
      'title': ['', [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(1)
      ]],
      'content': ['', []],
      'authorId': ['', []],
      'availableStartDate': ['', [
        Validators.required,
      ]],
      'availableEndDate': [],
      'categoryId': ['', []],
      'isFeatured': [],
      'canComment': [],
      'templateSlug':[]
    });
  }

  get f() { return this.blogForm.controls; }

  save() {
    this.saveData();
  }

  ImageTitle: string = "";
  ImagePath: string = "";
  saveData() {
    var blog: Blog = {

      id: this.id,
      title: this.f.title.value,
      slug: this.f.slug.value,
      content: this.f.content.value,
      categoryId: this.cateId,
      availableStartDate: this.f.availableStartDate.value,
      availableEndDate: this.f.availableEndDate.value,
      isFeatured: this.f.isFeatured.value,
      canComment: this.f.canComment.value,
      authorId: 2,
      templateSlug:this.f.templateSlug.value,
      isPublish: this.blog ? this.blog.isPublish:false,
      IsActive: false,
      comments: this.comments
    }
    console.log(blog)
    var observer: Observable<any>;
    if (blog.id == null || blog.id <= 0)
      observer = this.blogService.add(blog);
    else
      observer = this.blogService.edit(blog);

    observer.subscribe(result => {
      console.log("Response from server:");
      console.log("result",result);
      console.log(result.id);
      this.id = result.id;

      if (this.imageControl.file)
        this.imageControl.startUpload(result.id, "ID", "Blog", false, false);

      if (result.id)
        this.snakbar.open('Blog saved successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
    });
  }

  revert() { this.blogForm.reset(); }

  onFileComplete(data: any) {

    this.snakbar.open('Image uploaded successfully.', null, {
      duration: 2000,
    });

    this.ImageTitle = data.ImageTitle;
    this.ImagePath = data.ImagePath;
    //this.saveData();
  }

  requiredFileType(type: string) {
    return function (control: FormControl) {
      const file = control.value;
      if (file) {
        const extension = file.name.split('.')[1].toLowerCase();
        if (type.toLowerCase() !== extension.toLowerCase()) {
          return {
            requiredFileType: true
          };
        }

        return null;
      }
      return null;
    };
  }

  onEditComment(data) {
    if (this.isApproved == 0)
      this.isApproved = 1
    else
      this.isApproved = 0
  }


  onApproveComment(commentId, status:string){ 
    this.blogService.changeCommentStatus(this.id, status,commentId).subscribe(result => {
 
      if(result==true){ 
        this.loadTreeData()
        var text=''
        status =='approve'? text="Approved":text="Rejected"
        
        this.snakbar.open('Comment '+text+' successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
    });    
    
  }
  onAdvanceEdit() {
    let customComponents = [
      { type: 'ph-v-1', value: '{{placeholder 1}}', place_holder: 'Placeholder 1' },
      { type: 'ph-v-2', value: '{{placeholder 2}}', place_holder: 'Placeholder 2' },
      { type: 'ph-v-3', value: '{{placeholder 3}}', place_holder: 'Placeholder 3' },
      { type: 'ph-v-4', value: '{{placeholder 4}}', place_holder: 'Placeholder 4' }]


    const dialogRef = this.dialog.open(ContentbuilderComponent, {
      width: '100%',
      height: '100%',
      data: {
        content: this.f.content.value,
        custom_components: customComponents
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.blog.content = result.content;
        this.f.content.setValue(result.content);
      }
    });

  }

  update(data){
    this.f.content.setValue(data);
  }

}