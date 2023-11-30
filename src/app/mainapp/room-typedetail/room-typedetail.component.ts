import { Component, OnInit, ViewChild, ElementRef, Input, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router'; 
import { SelectionModel } from '@angular/cdk/collections';
import { RoomType } from 'src/app/models/RoomType';
import { RoomTypeService } from 'src/app/services/roomType.service';
import { SingleFileUploadComponent } from 'src/app/coreui/single-file-upload/single-file-upload.component';
 
@Component({
  selector: 'app-room-typedetail',
  templateUrl: './room-typedetail.component.html',
  styleUrls: ['./room-typedetail.component.scss']
})

export class RoomTypeDetailComponent {

  id: number;
  roomType: RoomType;
  roomTypeForm: FormGroup;
  color: string = '#ffffff'
  model = {};
  ImageTitle: string = "";
  ImagePath: string = "";
  fontFamily= [
    {
     style: "font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" ,
     value:'Arial',
     text:"Arial"
    },
    {
      style: "font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif" ,
      value:'Calibri',
      text:"Calibri"
    },
    {
      style: "font-family:'Times New Roman', Times, serif" ,
      value:"Times New Roman",
      text:"Times New Roman"
    },
    {
      style: "font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif" ,
      value:'Lucida Sans Unicode',
      text:"Lucida Sans Unicode"
    },
    {
      style: "font-family:monospace" ,
      value:'Monospace',
      text:"Monospace"
    },
    {
      style: "font-family:sans-serif" ,
      value:'sans-serif',
      text:"Sans-serif"
    }
  ]

  @ViewChild('imagefile', { static: true }) imagefile: ElementRef;
  @ViewChild('imageControl', { static: false }) imageControl: SingleFileUploadComponent;

  constructor(
    private route: ActivatedRoute, 
    private fb: FormBuilder,
    private RoomTypeService: RoomTypeService,
    private snakbar: MatSnackBar, 
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any) {
      console.log("request",request);

      if(request) {
        this.id = request.roomType.id
        this.roomType = request.roomType
      }
  }
  ngAfterViewInit(): void {
    if (this.roomType && this.roomType.image )
      this.imageControl.setImage(this.roomType.image.data);
  }
 
  ngOnInit() {
    this.buildForm();
    console.log("c",this.roomType)
    if(this.roomType){
      this.f.id.setValue(this.roomType.id);
      this.f.title.setValue(this.roomType.title);
      this.color = this.roomType.fontColor;
      this.f.fontType.setValue(this.roomType.fontType);
      this.f.showFirstMenu.setValue(this.roomType.showFirstMenu?this.roomType.showFirstMenu:false);
      this.f.firstMenuCode.setValue(this.roomType.firstMenuCode);
      this.f.showSecondMenu.setValue(this.roomType.showSecondMenu?this.roomType.showSecondMenu:false);
      this.f.secondMenuCode.setValue(this.roomType.secondMenuCode);
      this.f.generalMenuCode.setValue(this.roomType.generalMenuCode);
      
    }
  }

  buildForm() {
    console.log("build form ");
    this.roomTypeForm = this.fb.group({
      'id': [this.id, []],
      'title': ['', [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(1)
      ]],
      
      'fontColor': ['', []],
      'fontType': ['', []],
      'showFirstMenu': ['', []],
      'firstMenuCode': ['', []],
      'showSecondMenu': ['', []],
      'secondMenuCode': ['', []],
      'generalMenuCode': ['', []]
       
    });
  }

  get f() { return this.roomTypeForm.controls; }

  public onChangeColor(color: string): void {
    this.color = color;
    this.roomTypeForm.patchValue({ color });
    console.log('Color changed:', color);
  }

  save() {
    console.log('save call');
    var roomtype: RoomType = {
      id: this.id,
      fontType:this.f.fontType.value,
      fontColor:this.color,
      title: this.f.title.value,
      showFirstMenu: this.f.showFirstMenu.value?true:false,
      firstMenuCode: this.f.firstMenuCode.value,
      showSecondMenu: this.f.showSecondMenu.value?true:false,
      secondMenuCode: this.f.secondMenuCode.value,
      generalMenuCode: this.f.generalMenuCode.value,
      
    }
    console.log("before add" ,roomtype)
    var message:string
    var observer: Observable<any>;
    if (roomtype.id == null || roomtype.id <= 0){
      observer = this.RoomTypeService.add(roomtype); 
      message = "Created";
    }
    else{
      observer = this.RoomTypeService.edit(roomtype);
      message = "Updated"
    }

    observer.subscribe(result => {

      console.log("Response from server:");
      console.log(result);

      this.id = result.id;
      if (this.imageControl.file)
      this.imageControl.startUpload(result.id, "ID", "RoomType_BackGround", false, false);

      if (result.id) {

        this.snakbar.open('Room Type '+message+' successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
     });
  }

  revert() { this.roomTypeForm.reset(); }

  onFileComplete(data: any) {

    this.snakbar.open('Image uploaded successfully.', null, {
      duration: 2000,
    });
    console.log("FileComplete");
    console.log(data);

    this.ImageTitle = data.ImageTitle;
    this.ImagePath = data.ImagePath;
  }
}

