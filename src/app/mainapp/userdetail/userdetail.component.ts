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
import { User } from 'src/app/models/Users';
import { EditorConfig } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-userdetail',
  templateUrl: './userdetail.component.html',
  styleUrls: ['./userdetail.component.scss']
})
export class UserdetailComponent {

  id: number;
  user: User;
  userForm: FormGroup;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private userService: UserService, private snakbar: MatSnackBar, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public request: any) {
    
      console.log("request",request);
      if(request){
        this.user = request.user
        this.id = request.user.id;
      }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {

      this.buildForm();

      if (this.user) {
          this.f.id.setValue(this.user.id);
          this.f.title.setValue(this.user.title);
          this.f.username.setValue(this.user.username);
          this.f.firstName.setValue(this.user.firstName);
          this.f.lastName.setValue(this.user.lastName);
          this.f.email.setValue(this.user.email);
          this.f.mobile.setValue(this.user.mobile);
          this.f.password.setValue(this.user.password);
          this.f.active.setValue(this.user.active);
      }
    });
  }

  buildForm() {
    console.log("build form ");
    this.userForm = this.fb.group({
      'id': [this.id, []],
      'username': ['', [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(1)
      ]],
      'password': ['', []],
      'email': ['', []],
      'mobile': ['', []],
      'title': ['', []],
      'firstName': ['', []],
      'lastName': ['', []],
      'active': ['', []]
    });
  }

  get f() { return this.userForm.controls; }

  save() {
    console.log('save call');
    this.saveData();
  }
 
  saveData() {
    var user: User = {
      id: this.id,
      username: this.f.username.value,
      // password: this.f.password.value,
      email: this.f.email.value,
      mobile: this.f.mobile.value,
      title: this.f.title.value,
      firstName: this.f.firstName.value,
      lastName: this.f.lastName.value,
      active: this.f.active.value,
    }
    
    var observer: Observable<any>;
    if (user.id == null || user.id <= 0)
      observer = this.userService.add(user);
    else
      observer = this.userService.update(user);

    observer.subscribe(result => {
      console.log("Response from server:");
      console.log(result);
      this.id = result.id;
     });
  }

  revert() { this.userForm.reset(); }

}

