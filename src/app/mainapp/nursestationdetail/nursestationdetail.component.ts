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
import { NursingStation } from 'src/app/models/NursingStation';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { BranchService } from 'src/app/services/branch.service';
import { FloorService } from 'src/app/services/floor.service';
import { Floor } from 'src/app/models/Floor';
import { nursingStationService } from 'src/app/services/nursingStation.service';
import { User } from 'src/app/models/Users';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-nursestationdetail',
  templateUrl: './nursestationdetail.component.html',
  styleUrls: ['./nursestationdetail.component.scss']
})
export class NursingStationDetailComponent {

  id: number;
  nurseingStation: NursingStation;
  floors: any=[];
  Users:any;
  nursingStationForm: FormGroup;
 
  editorConfig: any = EditorConfig;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private branchService:BranchService, private UsersService:UserService, private floorService: FloorService, private NursingStationService: nursingStationService, private snakbar: MatSnackBar, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    console.log("request");
    if (request) {
      this.id = request.nursingStation.id;
      this.nurseingStation = request.nursingStation;
      console.log(this.nurseingStation);
    }
  }

  ngOnInit() {
    console.log("nursing Station para:" + this.id);
    this.buildForm();
    if (this.nurseingStation)
      this.setForm();

    this.floorService.loadData().subscribe(results => {
       results.forEach(element => {
         this.floors.push(element)
       });
    });
    this.UsersService.loadData().subscribe(results => {
      this.Users=results
   });
  }

  setForm() {
    this.f.title.setValue(this.nurseingStation.title);
    this.f.floorId.setValue(this.nurseingStation.floorId);
    this.f.inchargeUserId.setValue(this.nurseingStation.inchargeUserId);
    this.f.active.setValue(this.nurseingStation.active);

  }

  buildForm() {
    this.nursingStationForm = this.fb.group({
      'ID': [this.id, [
        //Validators.required
      ]],
      'title': ['', [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(1)]],
      'floorId': ['', []],
      'inchargeUserId': ['',[]],
      'active': ['', []]
    });

  }

  get f() { return this.nursingStationForm.controls; }

  save() {

    var nurseingStation: NursingStation = {
      id: this.id,
      title: this.f.title.value,
      floorId: this.f.floorId.value,
      sortOrder:0,
      inchargeUserId:this.f.inchargeUserId.value,
      active: (this.f.active.value == true) ? true : false
    }
 
    var observer: Observable<any>;
    var message:string;
    if (nurseingStation.id == null || nurseingStation.id <= 0){
      observer = this.NursingStationService.add(nurseingStation);
      message="Saved";
    }
    else{
      observer = this.NursingStationService.update(nurseingStation);
      message="Updated";      
    }
    observer.subscribe(result => {
      this.id = result.id;
      if (result.id)
        this.snakbar.open('Nursing Station '+message+' successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
    });

  }

  revert() {
    this.nursingStationForm.reset();
  }
 
}

