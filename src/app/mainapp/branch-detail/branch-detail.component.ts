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
import { Branch } from 'src/app/models/Branch';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { BranchService } from 'src/app/services/branch.service';
import { TemplatesService } from 'src/app/services/templates.service';
import { Templates } from 'src/app/models/Templates';

@Component({
  selector: 'app-branch-detail',
  templateUrl: './branch-detail.component.html',
  styleUrls: ['./branch-detail.component.scss']
})
export class BranchDetailComponent {

  templates: Templates[] = [];
  id: number;
  branch: Branch;
  branchForm: FormGroup;

  url: string = '';
  done: any;
  isBranchSaved: boolean = true;

  @ViewChild('imagefile', { static: true }) imagefile: ElementRef;
  @ViewChild('imageControl', { static: false }) imageControl: SingleFileUploadComponent;

  editorConfig: any = EditorConfig;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private branchService: BranchService, private snakbar: MatSnackBar, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    console.log("request");
    console.log(request);
    //this.id = request.id;
    if (request) {
      this.id = request.id;
      this.branch = request.branch;
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log("branchID para:" + this.id);

      this.buildForm();

      if (this.branch != null)
        this.setForm();
      if (this.branch == null && this.id > 0) {
        this.branchService.loadByID(this.id).subscribe(results => {
          this.branch = results;
          this.setForm();
        });
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.branch.image != null)
      this.imageControl.setImage(this.branch.image.data);
  }

  setForm() {

    this.f.title.setValue(this.branch.title);
    this.f.titleAr.setValue(this.branch.titleAr);
    
    this.f.branchId.setValue(this.branch.branchId);
    this.f.imageURL.setValue(this.branch.imageURL);
    this.f.shortName.setValue(this.branch.shortName);
    this.f.sortOrder.setValue(this.branch.sortOrder);
    this.f.active.setValue(this.branch.active);
  }

  buildForm() {
    this.branchForm = this.fb.group({
      'ID': [this.id, [
        //Validators.required
      ]],
      'title': ['', [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(1)
      ]],
      'titleAr': ['', [
        Validators.maxLength(500),
      ]],
      'branchId': ['', []],
      'imageURL': ['', []],
      'shortName': ['', []],
      'sortOrder': ['', []],
      'active': ['', []]
    });

  }

  get f() { return this.branchForm.controls; }

  save() {
    this.saveData();
  }

  ImageTitle: string = "";
  ImagePath: string = "";
  saveData() {

    var branch: Branch = {
      id: this.id,
      title: this.f.title.value,
      titleAr: this.f.titleAr.value,
      branchId: this.f.branchId.value,
      imageURL: this.f.imageURL.value,
      shortName: this.f.shortName.value,
      sortOrder: this.f.sortOrder.value,
      active: (this.f.active.value == true) ? true : false
    }

    // ///////////////////////////////////////////////////
    var observer: Observable<any>;
    if (branch.id == null || branch.id <= 0)
      observer = this.branchService.add(branch);
    else
      observer = this.branchService.update(branch);
    observer.subscribe(result => {
      this.id = result.id;
      if (this.imageControl.file)
        this.imageControl.startUpload(result.id, "ID", "Branch", false, false);

      if (result.id)
        this.snakbar.open('Branch saved successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
    });

  }

  revert() {
    this.branchForm.reset();
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

