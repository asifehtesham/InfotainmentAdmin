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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    fadeAnimation
  ]
})
export class LoginComponent implements OnInit {
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  userForm: FormGroup;
  formErrors = {
    'username': '',
    'password': ''
  };
  validationMessages = {
    'username': {
      'required': 'Please enter your username',
      'username': 'please enter your vaild username'
    },
    'password': {
      'required': 'please enter your password',
      'pattern': 'The password must contain numbers and letters',
      'minlength': 'Please enter more than 4 characters',
      'maxlength': 'Please enter less than 25 characters',
    }
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
    this.userForm = this.fb.group({
      'username': ['', [
        Validators.required,
        //Validators.email
      ]
      ],
      'password': ['', [
        //Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ]
      ],
    });

    this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  // convenience getter for easy access to form fields
  get f() { return this.userForm.controls; }

  onValueChanged(data?: any) {
    // if (!this.userForm) {
    //   return;
    // }
    // const form = this.userForm;
    // for (const field in this.formErrors) {
    //   if (Object.prototype.hasOwnProperty.call(this.formErrors, field)) {
    //     this.formErrors[field] = '';
    //     const control = form.get(field);
    //     if (control && control.dirty && !control.valid) {
    //       const messages = this.validationMessages[field];
    //       for (const key in control.errors) {
    //         if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
    //           this.formErrors[field] += messages[key] + ' ';
    //         }
    //       }
    //     }
    //   }
    // }
  }
  login() {
    console.log("login click");
    console.log(this.f.username.value);

    //this.router.navigate(['/']);
    console.log("Login query para1:" + this.returnUrl);

    this.submitted = true;

    // stop here if form is invalid
    if (this.userForm.invalid) {
      return;
    }

    this.loading = true;
    //TODO: Uncommment the following lines to allow subscribe
    console.log("Login query para2:" + this.returnUrl);
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          
          console.log("service called successfully");
          console.log(this.returnUrl);
          if (this.returnUrl == null || this.returnUrl == undefined)
            this.router.navigate(["/mainapp/dashboard"]);
          else
            this.router.navigate([this.returnUrl]);
        },
        error => {
          
          //console.log(error.error)
          this.snakbar.open('Invalid Username or Password', null, {
            duration: 2000,
          });
          this.f.username.setErrors({ 'incorrect': true });
          this.f.password.setErrors({ 'incorrect': true });
          //this.error = "Invalid Username or Password";
          this.loading = false;
        });

  }
  toggle() { }
}
