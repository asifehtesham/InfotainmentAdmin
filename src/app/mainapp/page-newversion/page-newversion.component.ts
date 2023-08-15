import { Component, OnInit, ViewChild, ElementRef, Input, Inject, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { SingleFileUploadComponent } from 'src/app/coreui/single-file-upload/single-file-upload.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Form } from 'src/app/models/Form';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { FormService } from 'src/app/services/form.service';
import { FormlistComponent } from '../Forms/formlist/formlist.component';
import { ValidationError } from 'webpack';
import { PagesService } from 'src/app/services/pages.service';

@Component({
  selector: 'app-form-newversion',
  templateUrl: './page-newversion.component.html',
  styleUrls: ['./page-newversion.component.scss']
})

export class PageNewversionComponent implements OnInit, AfterViewInit {

  id: number;
  //form: Form;
  AvailableVersion: Array<string>;
  formGroup: FormGroup;

  url: string = '';
  done: any;
  isFormSaved: boolean = true;

  //Parentform: Form[];

  editorConfig: any = EditorConfig;

  //#region Tag chip
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();

  hasError: boolean = false;
  @ViewChild('tagInput', { static: false }) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  //#endregion Tag chip

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private formService: FormService, private pageService: PagesService, private snakbar: MatSnackBar, private dialog: MatDialog,
    private dialogRef: MatDialogRef<FormlistComponent>,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    console.log("request");
    console.log(request);
    if (request) {

      this.id = request.pageId;
      this.AvailableVersion = request.AvailableVersion;
      //this.form = request.form;
    }
  }

  ngOnInit() {
    // this.questionService.loadData().subscribe(results => {
    //   //this.loadEmptyMsg = true;
    //   console.log('come to the subscriber');
    //   this.availableQuestions = results;
    // });
    console.log("AvailableVersion");
    console.log(this.AvailableVersion);
    this.route.params.subscribe(params => {

      //this.id = params['id'];
      //this.id = 0;
      console.log("formID para:" + this.id);

      this.buildForm();

    });
  }
  ngAfterViewInit(): void {
  }

  buildForm() {
    console.log("build form ");
    this.formGroup = this.fb.group({
      'ID': [this.id, [
        //Validators.required
      ]],
      'Version': ['', [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(1)
      ]]
    });

  }

  get f() { return this.formGroup.controls; }

  save() {
    console.log('save call');
    console.log(this.AvailableVersion.find(x => x === this.f.Version.value));
    if (this.AvailableVersion.find(x => x === this.f.Version.value) != null) {
      //show error
      this.hasError = true;
      console.log('errors');
      this.formGroup.setErrors({ incorrect: true });
      this.formGroup.controls['Version'].setErrors({ incorrect: true });
      //this.hasError = true;
    }
    else {
      console.log('no errors');
      this.hasError = false;
      this.saveData();
    }

  }

  hasErrors() {
    return (this.AvailableVersion.find(x => x === this.f.Version.value) != null);
  }
  saveData() {















    this.pageService.createNewVersion(this.id,this.f.Version.value).subscribe(result => {
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
     
      
      this.dialogRef.close(result);
    });






    // this.formService.create_version(this.id, this.f.Version.value).subscribe(params => {
    //   console.log('come to create_version subscriber: ');
    //   console.log(params);
    //   this.dialogRef.close(params);
    // });

  }

  revert() {
    this.formGroup.reset();
  }


}

