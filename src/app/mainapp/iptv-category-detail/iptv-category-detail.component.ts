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
import { IptvCategory } from 'src/app/models/IptvCategory';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { IptvCategoryService } from 'src/app/services/iptvCategory.service';
import { TemplatesService } from 'src/app/services/templates.service';
import { Templates } from 'src/app/models/Templates';

@Component({
  selector: 'app-iptv-category-detail',
  templateUrl: './iptv-category-detail.component.html',
  styleUrls: ['./iptv-category-detail.component.scss']
})
export class IptvCategoryDetailComponent {

  templates: Templates[] = [];
  id: number;
  iptvCategory: IptvCategory;
  iptvCategoryForm: FormGroup;

  url: string = '';
  done: any;
  isIptvCategorySaved: boolean = true;

  @ViewChild('imagefile', { static: true }) imagefile: ElementRef;
  @ViewChild('imageControl', { static: false }) imageControl: SingleFileUploadComponent;

  editorConfig: any = EditorConfig;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private iptvCategoryService: IptvCategoryService, private snakbar: MatSnackBar, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    console.log("request");
    console.log(request);
    //this.id = request.id;
    if (request) {
      this.id = request.id;
      this.iptvCategory = request.iptvCategory;
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log("iptvCategoryID para:" + this.id);

      this.buildForm();

      if (this.iptvCategory != null)
        this.setForm();
      if (this.iptvCategory == null && this.id > 0) {
        this.iptvCategoryService.loadByID(this.id).subscribe(results => {
          this.iptvCategory = results;
          this.setForm();
        });
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.iptvCategory.image != null)
      this.imageControl.setImage(this.iptvCategory.image.data);
  }

  setForm() {

    this.f.title.setValue(this.iptvCategory.title);
    this.f.titleAr.setValue(this.iptvCategory.titleAr);
    this.f.imageURL.setValue(this.iptvCategory.imageURL);
    this.f.sortOrder.setValue(this.iptvCategory.sortOrder);
    this.f.active.setValue(this.iptvCategory.active);
  }

  buildForm() {
    this.iptvCategoryForm = this.fb.group({
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
      'imageURL': ['', []],
      'sortOrder': ['', []],
      'active': ['', []]
    });

  }

  get f() { return this.iptvCategoryForm.controls; }

  save() {
    this.saveData();
  }

  ImageTitle: string = "";
  ImagePath: string = "";
  saveData() {

    var iptvCategory: IptvCategory = {
      id: this.id,
      title: this.f.title.value,
      titleAr: this.f.titleAr.value,
      imageURL: this.f.imageURL.value,
      sortOrder: this.f.sortOrder.value,
      active: (this.f.active.value == true) ? true : false
    }

    // ///////////////////////////////////////////////////
    var observer: Observable<any>;
    if (iptvCategory.id == null || iptvCategory.id <= 0)
      observer = this.iptvCategoryService.add(iptvCategory);
    else
      observer = this.iptvCategoryService.update(iptvCategory);
    observer.subscribe(result => {
      this.id = result.id;
      if (this.imageControl.file)
        this.imageControl.startUpload(result.id, "ID", "IptvCategory", false, false);

      if (result.id)
        this.snakbar.open('IptvCategory saved successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
    });

  }

  revert() {
    this.iptvCategoryForm.reset();
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

