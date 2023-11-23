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
import { Servicerequest,ServiceStatus, ComplainStatus } from 'src/app/models/Servicerequest';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { ServicerequestService } from 'src/app/services/servicerequest.service';
import { BranchService } from 'src/app/services/branch.service';
import { RoomServiceService } from 'src/app/services/roomService.service';
import { RoomsService } from 'src/app/services/rooms.service';
import { ServicerequestDetailComponent } from '../servicerequest-detail/servicerequest-detail.component';

@Component({
  selector: 'app-patient-complaint-detail',
  templateUrl: './patient-complaint.component.html'
})
export class PatientComplaintComponent {
  ServiceStatus = ServiceStatus;
  ComplainStatus = ComplainStatus;
  
  id: number;
  serviceComplaintList: any;
   
  paginatedRooms: any = [];
  page = 0;
  size = 10;
  index: number = 1;
  limit: number = 10;
  room:any
  services: SelectModel[];
  rooms: SelectModel[];
  
  constructor(private route: ActivatedRoute, private fb: FormBuilder, private servicerequestService: ServicerequestService, private roomServiceService: RoomServiceService, private snakbar: MatSnackBar,
    private roomsService: RoomsService,

    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    console.log("request");
    console.log(request);
    //this.id = request.id;
    if (request) {
      this.room=request.room
      this.serviceComplaintList = request.room.serviceComplaintList;
    }
  }

  ngOnInit() {

  }
 

   

  updateStatus(s,e){

    // let element = e;
    // element.status = s;
    
    // this.servicerequestService.update(element).subscribe(result => {
    //   if (result) {
    //     this.snakbar.open('Your status has been updated successfully.', 'Ok', {
    //       duration: 2000,
    //     });
    //     this.loadData();

        

    //     let selectedArr = this.serviceComplaintList.indexOf(element);
    //     if (selectedArr != -1){
    //       this.serviceComplaintList.splice(selectedArr, 1);
    //     } 


    //   }

    // });
  }
}

