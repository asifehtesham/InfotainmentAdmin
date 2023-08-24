


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
import { BranchService } from 'src/app/services/branch.service';
import { FloorService } from 'src/app/services/floor.service';
import { Branch } from 'src/app/models/Branch';
import { Floor } from 'src/app/models/Floor';
import { PatientAdmission } from 'src/app/models/PatientAdmission';


@Component({
  selector: 'app-patientrecord',
  templateUrl: './patientrecord.component.html',
  styleUrls: ['./patientrecord.component.scss']
})
export class PatientRecordComponent {
  id: number;
  admittedPatient: PatientAdmission;
  admissionHistory = []

  constructor(private route: ActivatedRoute, private branchService:BranchService,private floorService: FloorService, private roomsService: RoomsService, private snakbar: MatSnackBar, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    console.log("patient record request");
    if (request) {
      console.log("req",request.room.currentAdmission)
      this.id = request.id;
      this.admittedPatient = request.room.currentAdmission;
      this.admissionHistory = request.room.admissionHistory;
    }
  }

  ngOnInit() {
  
 
  }

}

