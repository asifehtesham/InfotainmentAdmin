import { Component, OnInit, ViewChild, ElementRef, Input, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { SingleFileUploadComponent } from 'src/app/coreui/single-file-upload/single-file-upload.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
//import { SectionAddComponent } from 'src/app/admin/Courses/sectionadd/section-add.component';
import { Poll } from 'src/app/models/Poll';
import { Option } from 'src/app/models/Option';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { PollService } from 'src/app/services/poll.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-polldetail',
  templateUrl: './polldetail.component.html',
  styleUrls: ['./polldetail.component.scss']
})
export class PolldetailComponent {

  id: number;
  poll: Poll;
  pollForm: FormGroup; 
  ImageTitle: string = "";
  ImagePath: string = "";
  sortId:number = 1;
  sortOption:any = []  
  option: Option;
  @ViewChild('imagefile', { static: true }) imagefile: ElementRef;
  @ViewChild('imageControl', { static: false }) imageControl: SingleFileUploadComponent;

  editorConfig: any = EditorConfig;
  
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private pollService: PollService, private snakbar: MatSnackBar, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    request ? this.id = request.id : null
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      
      console.log("pollID para:" + this.id);

      this.buildForm();

      if (this.id > 0) {
        this.pollService.loadByID(this.id).subscribe(results => {
         
          this.poll = results;
          this.f.title.setValue(this.poll.title);
          this.f.slug.setValue(this.poll.slug);
          this.f.content.setValue(this.poll.content);
          this.f.availableStartDate.setValue(this.poll.availableStartDate);
          this.f.availableEndDate.setValue(this.poll.availableEndDate);
          this.f.isPublish.setValue(this.poll.isPublish); 
          this.f.canVisitorVote.setValue(this.poll.canVisitorVote); 
          this.f.canVoterSeeResult.setValue(this.poll.canVoterSeeResult); 
          if (this.poll.image) {
            this.imageControl.setImage(this.poll.image.data);
          }
          if(this.poll.options.length > 0) {
            this.sortId = this.poll.options.length + 1;
            this.sortOption = this.poll.options;
          }
        });
      }
    });
  }
  buildForm() {
    console.log("build form ");
    this.pollForm = this.fb.group({
      'ID': [this.id, [
      ]],
      'slug': ['', [
        Validators.maxLength(5000)
      ]],
      'title': ['', [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(1)
      ]],
      'content': ['', []],
      'availableStartDate':new FormControl((new Date()).toISOString().substring(0,10)),
      'availableEndDate': ['', [Validators.required]],
      'isPublish': ['', []],
      'canVisitorVote':[],
      'canVoterSeeResult':[],
      'options':[]
    });

  }
  get f() { return this.pollForm.controls; }
  save() {
    console.log('save call');
    this.saveData();
  }
  saveData() {
    var poll: Poll = {
      id: this.id,
      title: this.f.title.value,
      slug: this.f.slug.value,
      content: this.f.content.value,
      availableStartDate: this.f.availableStartDate.value,
      availableEndDate: this.f.availableEndDate.value,
      isPublish: this.f.isPublish.value == null ? false : true,
      canVisitorVote: this.f.canVisitorVote.value == null?false:true,
      canVoterSeeResult:this.f.canVoterSeeResult.value == null ? false : true,
      options:null
    }
    var observer: Observable<any>;
    if (poll.id == null || poll.id <= 0)
      observer = this.pollService.add(poll);
    else
      observer = this.pollService.edit(poll);

    observer.subscribe(result => {
      console.log("Response from server:");
      console.log("result",result);
      this.id = result.id;

      if (this.imageControl.file)
        this.imageControl.startUpload(result.id, "ID", "Poll", false, false);

      if (result.id)
        this.snakbar.open('Poll created successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
    });
  }
  revert() {
    this.pollForm.reset();
  }
  onFileComplete(data: any) {

    this.snakbar.open('Image uploaded successfully.', null, {
      duration: 2000,
    });
    console.log("FileComplete");
    console.log(data); // We just print out data bubbled up from event emitter.

    this.ImageTitle = data.ImageTitle;
    this.ImagePath = data.ImagePath;
    //this.saveData();
  }
  requiredFileType(type: string) {
    return function (control: FormControl) {
      const file = control.value;
      if (file) {
        const extension = file.name.split('.')[1].toLowerCase();
        if (type.toLowerCase() !== extension.toLowerCase()) {
          return {
            requiredFileType: true
          };
        }

        return null;
      }
      return null;
    };
  }
  addOption(option){
    if(option){
      var newOption: Option = {
        pollId: this.id,
        title: option,
        content: null,
        sortId: this.sortId,
        votes: 0,
      }
      this.pollService.addOption(newOption).subscribe(results => {
        this.sortOption.push(results)
        this.sortId = this.sortId + 1;
        console.log(this.sortOption)
        this.value="Add"
        this.snakbar.open('Option created successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      });
    } 
    else {
      this.snakbar.open('Option Field Should not be Null.', 'Dismise', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    }
  }
  updateOption(option){
    if(option){
      var updateOption: Option = {
        pollId: this.option.pollId,
        title: option,
        content: null,
        sortId: this.option.sortId,
        votes: this.option.votes,
        id:this.option.id
      }
      this.pollService.updateOption(updateOption).subscribe(results => {
       this.loadOptions(this.id)
        this.value="Add"
        this.snakbar.open('Option Updated successfully.', 'Dismise', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      });
    } 
    else {
      this.snakbar.open('Option Field Should not be Null.', 'Dismise', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    }
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sortOption, event.previousIndex, event.currentIndex);
    
    this.sortOption.forEach((element,index)=>{
      element.sortId = index+1;
    })
    console.log(this.sortOption)
    this.pollService.movedOption(this.sortOption).subscribe(result=>{
      if(result)
      this.snakbar.open('Option moved Successfully.', 'Dismise', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    })
  }
  loadOptions(pollId:number){
    console.log(pollId)
    this.pollService.loadOptions(pollId).subscribe(results => {
      console.log("res",results)
      this.sortOption = results;
    })
  }
  value="Add"
  editOption(option: Option){
    console.log(option)
    this.option = option
    this.value = "Update"
    this.f.options.setValue(this.option.title)

  }
  deleteOption(option: Option) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pollService.deleteOption(option).subscribe(params => {
          
          console.log(params);
          if(params)
            this.loadOptions(option.pollId);
        });
        
      }
      else{
        Swal.fire(
          'Cancelled',
          'Your Option is safe :)',
          'error'
        )
      }
    })
   
    // this.sortOption.splice(id,1);
  }
}

