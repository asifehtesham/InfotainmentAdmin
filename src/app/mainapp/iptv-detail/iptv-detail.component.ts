


import { Component, OnInit, ViewChild, ElementRef, Input, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { SingleFileUploadComponent } from 'src/app/coreui/single-file-upload/single-file-upload.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IPTV } from 'src/app/models/IPTV';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { IPTVService } from 'src/app/services/iptv.service';
import { TemplatesService } from 'src/app/services/templates.service';
import { Templates } from 'src/app/models/Templates';

import { BranchService } from 'src/app/services/branch.service';
import { IptvCategoryService } from 'src/app/services/iptvCategory.service';


@Component({
  selector: 'app-iptv-detail',
  templateUrl: './iptv-detail.component.html',
  styleUrls: ['./iptv-detail.component.scss']
})
export class IPTVDetailComponent {


  templates: Templates[] = [];
  id: number;
  iptv: IPTV;
  iptvForm: FormGroup;

  url: string = '';
  done: any;
  isIPTVSaved: boolean = true;



  branches: SelectModel[];
  iptvCategories: SelectModel[];


  @ViewChild('imagefile', { static: true }) imagefile: ElementRef;
  @ViewChild('imageControl', { static: false }) imageControl: SingleFileUploadComponent;

  editorConfig: any = EditorConfig;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private iptvService: IPTVService, private snakbar: MatSnackBar, private dialog: MatDialog,
    private  branchService: BranchService,
    private iptvCategoryService: IptvCategoryService,
  @Inject(MAT_DIALOG_DATA) public request: any) {
    console.log("request");
    console.log(request);
    //this.id = request.id;
    if (request) {
      this.id = request.id;
      this.iptv = request.iptv;
    }
  }

  ngOnInit() {


    var temp1 = [];
    this.branchService.loadData().subscribe((results) => {
      temp1.push({ id: 0, title: "No Branch" });
      results.forEach((element) => {
        temp1.push({ id: element.id, title: element.title });
      });
    });

    console.log("this.branches",this.branches);
    this.branches = temp1;


    var temp = [];
    this.iptvCategoryService.loadData().subscribe((results) => {
      temp.push({ id: 0, title: "No Categories" });
      results.forEach((element) => {
        temp.push({ id: element.id, title: element.name });
      });
    });

    
    console.log("iptvCategories",this.iptvCategories);
    this.iptvCategories = temp;

    

    
    this.route.params.subscribe(params => {
      console.log("iptvID para:" + this.id);

      this.buildForm();

      if (this.iptv != null)
        this.setForm();
      if (this.iptv == null && this.id > 0) {
        this.iptvService.loadByID(this.id).subscribe(results => {
          this.iptv = results;
          this.setForm();
        });
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.iptv.image != null)
      this.imageControl.setImage(this.iptv.image.data);
  }

  setForm() {

    this.f.categoryID.setValue(this.iptv.categoryID);
    this.f.projectID.setValue(this.iptv.projectID);
    this.f.title.setValue(this.iptv.title);
    this.f.titleAr.setValue(this.iptv.titleAr);
    this.f.imageURL.setValue(this.iptv.imageURL);
    this.f.serviceURL.setValue(this.iptv.serviceURL);
    this.f.sortOrder.setValue(this.iptv.sortOrder);
    this.f.active.setValue(this.iptv.active);
  }

  buildForm() {
    this.iptvForm = this.fb.group({
      'ID': [this.id, [
        //Validators.required
      ]],
      'categoryID': ['', []],
      'projectID': ['', []],
      'title': ['', [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(1)
      ]],
      'titleAr': ['', [
        // Validators.maxLength(500),
      ]],
      'imageURL': ['', []],
      'serviceURL': ['', []],
      'sortOrder': ['', []],
      'active': ['', []]
    });

  }

  get f() { return this.iptvForm.controls; }

  save() {
    this.saveData();
  }

  ImageTitle: string = "";
  ImagePath: string = "";
  saveData() {

    var iptv: IPTV = {
      id: this.id,
      projectID: this.f.projectID.value,
      categoryID: this.f.categoryID.value,
      title: this.f.title.value,
      titleAr: this.f.titleAr.value,
      imageURL: this.f.imageURL.value,
      serviceURL: this.f.serviceURL.value,
      sortOrder: this.f.sortOrder.value,
      active: (this.f.active.value == true) ? true : false
    }

    // ///////////////////////////////////////////////////
    var observer: Observable<any>;
    if (iptv.id == null || iptv.id <= 0)
      observer = this.iptvService.add(iptv);
    else
      observer = this.iptvService.update(iptv);
    observer.subscribe(result => {
      this.id = result.id;
      if (this.imageControl.file)
        this.imageControl.startUpload(result.id, "ID", "IPTV", false, false);

      if (result.id)
        this.snakbar.open('IPTV saved successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
    });

  }

  revert() {
    this.iptvForm.reset();
  }

  onFileComplete(data: any) {

    this.snakbar.open('Image uploaded successfully.', null, {
      duration: 2000,
    });
    console.log("FileComplete");
    console.log(data); // We just print out data bubbled up from event emitter.

    this.ImageTitle = data.ImageTitle;
    this.ImagePath = data.ImagePath;
    //this.saveData();
  }

  requiredFileType(type: string) {
    return function (control: FormControl) {
      const file = control.value;
      if (file) {
        const extension = file.title.split('.')[1].toLowerCase();
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
}

