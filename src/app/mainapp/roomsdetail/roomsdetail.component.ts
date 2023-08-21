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

@Component({
  selector: 'app-roomsdetail',
  templateUrl: './roomsdetail.component.html',
  styleUrls: ['./roomsdetail.component.scss']
})
export class RoomsDetailComponent {

  templates: Templates[] = [];
  id: number;
  room: Rooms;
  branches: any =[];
  floors: any=[];
  roomForm: FormGroup;
  roomType=['Patient','Admin','ICU','Surgery','Waiting']
  url: string = '';
  done: any;
  isIPTVSaved: boolean = true;
 
  editorConfig: any = EditorConfig;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private branchService:BranchService,private floorService: FloorService, private roomsService: RoomsService, private snakbar: MatSnackBar, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    console.log("request");
    console.log(request);
    //this.id = request.id;
    if (request) {
      this.id = request.id;
      this.room = request.room;
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log("roomId para:" + this.id);

      this.buildForm();

      if (this.room != null)
        this.setForm();
      if (this.room == null && this.id > 0) {
        this.roomsService.loadByID(this.id).subscribe(results => {
          this.room = results;
          this.setForm();
        });
      }
    });



    this.branchService.loadData().subscribe(results => {
      results.forEach(element => {
        this.branches.push(element);
        
      }); 
    });

    this.floorService.loadData().subscribe(results => {
       results.forEach(element => {
         this.floors.push(element)
       });
    });

  }
 

  setForm() {
    this.f.roomId.setValue(this.room.roomId);
    this.f.roomType.setValue(this.room.roomType);
    this.f.floor.setValue(this.room.floor);
    this.f.branch.setValue(this.room.branch);
    this.f.IP.setValue(this.room.IP);
    this.f.status.setValue(this.room.status);
  }

  buildForm() {
    this.roomForm = this.fb.group({
      'ID': [this.id, [
        //Validators.required
      ]],
      'roomId': ['', [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(1)]],
      'roomType': ['', []],
      'floor': ['', []],
      'branch': ['', []],
      'IP': ['', []],
      'status': ['', []]
    });

  }

  get f() { return this.roomForm.controls; }

  save() {
    this.saveData();
  }
 
  saveData() {

    var room: Rooms = {
      id: this.id,
      roomId: this.f.roomId.value,
      roomType: this.f.roomType.value,
      floor: this.f.floor.value,
      branch: this.f.branch.value,
      IP: this.f.IP.value,
      status: (this.f.status.value == true) ? true : false
    }

    // ///////////////////////////////////////////////////
    var observer: Observable<any>;
    if (room.id == null || room.id <= 0)
      observer = this.roomsService.add(room);
    else
      observer = this.roomsService.update(room);
    observer.subscribe(result => {
      this.id = result.id;
      
      if (result.id)
        this.snakbar.open('Room saved successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
    });

  }

  revert() {
    this.roomForm.reset();
  }
 
}

