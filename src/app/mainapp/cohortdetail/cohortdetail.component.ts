import { Component, OnInit, ViewChild, ElementRef, Input, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { User } from 'src/app/models/Users';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router'; 
import { SelectionModel } from '@angular/cdk/collections';
import { Cohort } from 'src/app/models/Cohort';
import { CohortService } from 'src/app/services/cohort.service';

@Component({
  selector: 'app-cohortdetail',
  templateUrl: './cohortdetail.component.html',
  styleUrls: ['./cohortdetail.component.scss']
})
export class CohortdetailComponent {

  id: number;
  cohort: Cohort;
  cohortForm: FormGroup;
  contentData: any;

  constructor(
    private route: ActivatedRoute, 
    private fb: FormBuilder,
    private cohortService: CohortService,
    private snakbar: MatSnackBar, 
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any) {
      console.log("request",request);
      if(request) {
        this.cohort=request.cohort
        this.id= request.cohort.id
      }
  }

  ngOnInit() {
    this.buildForm();
    if(this.cohort){
      console.log("c",this.cohort)
      this.f.id.setValue(this.cohort.id);
      this.f.name.setValue(this.cohort.cohortName);
      this.contentData = this.cohort.description
      this.f.isVisible.setValue(this.cohort.visible);
    }
  }

  buildForm() {
    console.log("build form ");
    this.cohortForm = this.fb.group({
      'id': [this.id, []],
      'name': ['', [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(1)
      ]],
      
      'description': ['', []],
      'isVisible': ['', []],
       
    });
  }

  get f() { return this.cohortForm.controls; }

  save() {
    console.log('save call');
    this.saveData();
  }
 
  saveData() {
    var cohort: Cohort = {
      id: this.id,
      cohortName: this.f.name.value,
      description: this.contentData,
      visible: this.f.isVisible.value,
    }
    console.log("before add" ,cohort)

    var observer: Observable<any>;
    if (cohort.id == null || cohort.id <= 0)
      observer = this.cohortService.add(cohort);
    else
      observer = this.cohortService.edit(cohort);

    observer.subscribe(result => {
      console.log("Response from server:");
      console.log(result);
      console.log(result.id);
      this.id = result.id;
     });
  }

  revert() { this.cohortForm.reset(); }

  update(data){
    // this.f.content.setValue(data); 
  this.contentData=data
  }
}

