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
import { Page } from 'src/app/models/Page';
import { PageContent } from 'src/app/models/PageContent';

import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { PagesService } from 'src/app/services/pages.service';

import { TemplatesService } from "src/app/services/templates.service";
import { element } from 'protractor';

import Swal from "sweetalert2";


@Component({
  selector: 'app-pagedetail',
  templateUrl: './newversion.component.html',
  styleUrls: ['./newversion.component.scss']
})
export class NewversionComponent {

  id: number;
  page: Page;
  pageForm: FormGroup;
  url: string = '';
  done: any;
  isPageSaved: boolean = true;
  pageTemplate: SelectModel[];

  //Parentpage: Page[];
  @ViewChild('imagefile', { static: true }) imagefile: ElementRef;
  @ViewChild('imageControl', { static: false }) imageControl: SingleFileUploadComponent;

  editorConfig: any = EditorConfig;

  //#region Tag chip
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tags: string[] = [];
  allTags: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  todo: any = [];

  @ViewChild('tagInput', { static: false }) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  //#endregion Tag chip

  constructor(private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private pageService: PagesService, private templatesService: TemplatesService, private snakbar: MatSnackBar, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any) {
      this.id = (request?.pageId)?request.pageId:0;
    }
  ngOnInit() {

  }


  createVersion(versionName){
    this.pageService.createNewVersion(this.id,versionName).subscribe(result => {
      if(result.id){
        // Swal.fire({
        //   title: "Congractulations!",
        //   text: "Your version has been created successfully.",
        //   icon: "success", 
        // })

        this.snakbar.open('Your version has been created successfully.', 'Ok', {
          duration: 2000,
        });

      }else{

        // Swal.fire({
        //   title: "Error!",
        //   text: "Sorry we are unable to create your new version.",
        //   icon: "error",
        // })

        this.snakbar.open('Sorry we are unable to create your new version.', 'Ok', {
          duration: 2000,
        });

      }
     
    });




    

  }

}

