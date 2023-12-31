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
import { RoomTypeService } from 'src/app/services/roomType.service';

@Component({
  selector: 'app-roomsdetail',
  templateUrl: './roomsdetail.component.html',
  styleUrls: ['./roomsdetail.component.scss']
})
export class RoomsDetailComponent {


  IpData: any;
  ipaddress: any = "111.111.111.111";
  currectpattern: any = "";
  onedata: any = /\d/;
  splitted: any;
  maskpattern: any = [];
  mask: any;

  templates: Templates[] = [];
  id: number;
  room: any;
  branches: any = [];
  floors: any = [];
  roomForm: FormGroup;
  roomTypes = []
  url: string = '';
  done: any;
  isIPTVSaved: boolean = true;

  editorConfig: any = EditorConfig;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private roomTypeService: RoomTypeService, private branchService: BranchService, private floorService: FloorService, private roomsService: RoomsService, private snakbar: MatSnackBar, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any) {

    let data = this.ipaddress.split(".");
    let j = 0;
    data.forEach(element => {
      for (let index = 0; index < element.length; index++) {
        if (index == 0 && j != 0) {
          this.maskpattern.push(('.'))
        }
        this.maskpattern.push(new RegExp('\\d'))
      }
      j++;
    });
    console.log("------------------")
    console.log(this.ipaddress)

    this.mask = {
      guide: true,
      showMask: true,
      mask: this.maskpattern
    };

    if (request) {
      this.id = request.id;
      this.room = request.room;
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log("roomNo para:" + this.id);

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
    this.roomTypeService.loadData().subscribe(results => {
      results.forEach(element => {
        this.roomTypes.push(element);
      });
    });
  }

  setForm() {
    this.floors=[this.room.floor]

    this.f.roomNo.setValue(this.room.roomNo);
    this.f.roomTypeId.setValue(this.room.roomTypeId);
    this.f.floorId.setValue(this.room.floorId);
    this.f.branchId.setValue(this.room.branchId);
    this.IpData = this.room.ip;
    this.f.status.setValue(this.room.status);
  }

  buildForm() {
    this.roomForm = this.fb.group({
      'ID': [this.id, [
        //Validators.required
      ]],
      'roomNo': ['', [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(1)]],
      'roomTypeId': [],
      'floorId': ['', []],
      'branchId': ['', []],
      'status': ['', []],
      'ip': ['', []]
    });

  }

  get f() { return this.roomForm.controls; }

  save() {

    var room: Rooms = {
      id: this.id,
      roomNo: this.f.roomNo.value,
      roomTypeId: this.f.roomTypeId.value,
      floorId: this.f.floorId.value,
      branchId: this.f.branchId.value,
      ip: this.IpData,
      sortOrder: 0,
      status: (this.f.status.value == true) ? true : false
    }

    var observer: Observable<any>;
    var message
    if (room.id == null || room.id <= 0) {
      observer = this.roomsService.add(room);
      message = "Saved"
    }
    else {
      observer = this.roomsService.update(room);
      message = "Updated"
    }
    observer.subscribe(result => {
      this.id = result.id;

      if (result.id)
        this.snakbar.open('Room ' + message + ' successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
    });

  }

  revert() { this.roomForm.reset(); }

  findFloors(event) {
    this.floors = []
    this.floorService.loadFloors(event.value).subscribe(results => {
      results.forEach(element => {
        this.floors.push(element)
      });
    });
  }
}

