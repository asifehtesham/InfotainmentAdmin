import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { AuthService } from '../../core/auth.service';
import { first } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fadeAnimation } from 'src/app/animations';
//import  from 'rxjs/operator/filter';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
  animations: [
    fadeAnimation
  ]
})
export class ForgotComponent implements OnInit {
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  forgotForm: FormGroup;
  formErrors = {
    'email': ''
  };
  validationMessages = {
    'email': {
      'required': 'Please enter your email', 
    },
     
  };

  constructor(private authenticationService: AuthService,
    private router: Router,
    private snakbar: MatSnackBar,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    ngZone: NgZone) {


    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }

    window['onSignIn'] = (user) => ngZone.run(() => this.onSignIn(user));

  }

  onSignIn(googleUser) {
    //now it gets called
    console.log("Google login called!");

  }

  ngOnInit() {


    //debugger;
    this.buildForm();

    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'];

      console.log("Login query para:" + this.returnUrl);
    });

  }

  buildForm() {
    this.forgotForm = this.fb.group({
      'email': ['', [
        Validators.required,
        //Validators.email
      ]]
    });

    this.forgotForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  // convenience getter for easy access to form fields
  get f() { return this.forgotForm.controls; }

  onValueChanged(data?: any) {
  }
  forgot() {
    console.log("forgot click");
    console.log(this.f.email.value);

    //this.router.navigate(['/']);
    console.log("Login query para1:" + this.returnUrl)
  }
  toggle() { }
}
