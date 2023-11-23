


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
import { Rooms } from 'src/app/models/Rooms';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { RoomsService } from 'src/app/services/rooms.service';
import { TemplatesService } from 'src/app/services/templates.service';
import { Templates } from 'src/app/models/Templates';
import { FloorService } from 'src/app/services/floor.service';
import { AdmitPatientService } from 'src/app/services/admitPatient.service';
import { Floor } from 'src/app/models/Floor';
import { PatientAdmission } from 'src/app/models/PatientAdmission'

@Component({
  selector: 'app-admitpatient',
  templateUrl: './admitpatient.component.html',
  styleUrls: ['./admitpatient.component.scss']
})
export class AdmitPatientComponent {
  id: number;
  room: Rooms;
  patientAdmission:PatientAdmission;
  admitPatientForm: FormGroup; 
  gender=[
    {
      id:0,
      value:'Male'
    },
    {
      id:1,
      value:'Female'
    },
    {
      id:2,
      value:'Unknown'
    }
  ]
  admitType=[
    {
      id:0,
      value:'Admit'
    },
    {
      id:1,
      value:'Discharge'
    },
    {
      id:2,
      value:'Unknown'
    }
  ]
  editorConfig: any = EditorConfig;
  constructor( private admitPatientService:AdmitPatientService,private fb: FormBuilder,private route: ActivatedRoute, private floorService: FloorService, private roomsService: RoomsService, private snakbar: MatSnackBar, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any) {
      console.log("add patient");
      if (request) {
        this.room = request.room;
        
        // console.log("room",this.room)
      }
    }
    
    ngOnInit() {
     
      this.route.params.subscribe(params => {
        console.log("patient number para:" + this.id);
  
        this.buildForm();
        this.f.roomNo.setValue(this.room.roomNo)
        this.f.branchId.setValue(this.room.branch.shortName)

        if (this.patientAdmission != null)
          this.setForm();
        if (this.patientAdmission == null && this.id > 0) {
          this.admitPatientService.loadByID(this.room.roomNo).subscribe(results => {
            this.patientAdmission = results;
            this.setForm();
          });
        }
      });     
    }
  
    setForm() {
      this.f.admissionNo.setValue(this.patientAdmission.admissionNo);
      this.f.fileNo.setValue(this.patientAdmission.fileNo);
      this.f.branchId.setValue(this.patientAdmission.branchId);
      this.f.roomNo.setValue(this.patientAdmission.roomNo);
      this.f.admitDate.setValue(this.patientAdmission.admitDate);
      this.f.assignedDoctor.setValue(this.patientAdmission.assignedDoctor);
      this.f.patientName.setValue(this.patientAdmission.patientName);
      this.f.age.setValue(this.patientAdmission.age);
      this.f.gender.setValue(this.patientAdmission.gender);
      this.f.mobile.setValue(this.patientAdmission.mobile);
    }
  
    buildForm() {
      this.admitPatientForm = this.fb.group({
        'ID': [this.id, [
          //Validators.required
        ]],
        'admissionNo': ['', [
          Validators.required,
          Validators.maxLength(500),
          Validators.minLength(1)]],
        'fileNo': [],
        'branchId': ['', []],
        'roomNo': ['', []],
        'admitDate': [new Date(), [Validators.required]],
        'assignedDoctor': ['', [Validators.required,
          Validators.maxLength(500),
          Validators.minLength(1)]],
        'patientName': ['', [Validators.required,
          Validators.maxLength(500),
          Validators.minLength(1)]],
        'mobile': ['', []],
        'age': ['', []],
        'gender': ['', []]
      });
  
    }
  
    get f() { return this.admitPatientForm.controls; }
  
    save() {
      this.saveData();
    }
   
    saveData() {
      // this.f.roomNo.setValue(this.room.roomNo)
      var admit: PatientAdmission = {
        id: this.id,
        roomNo: this.room.roomNo,
        admissionNo: this.f.admissionNo.value,
        fileNo: this.f.fileNo.value,
        branchId: this.room.branchId,
        admitDate: this.f.admitDate.value,
        assignedDoctor: this.f.assignedDoctor.value,
        patientName: this.f.patientName.value,
        mobile: this.f.mobile.value,
        gender: this.f.gender.value,
        age: this.f.age.value,
        status: 0
      }
   
      var observer: Observable<any>;
      if (admit.id == null || admit.id <= 0)
        observer = this.admitPatientService.add(admit);
      else
        observer = this.admitPatientService.update(admit);
      observer.subscribe(result => {
        this.id = result.id;
        
        if (result.id)

          this.snakbar.open('Patient Admitted successfully.', 'Dismise', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          
      });
  
    }
  
    revert() {
      this.admitPatientForm.reset();
    }
   
  }
  
  