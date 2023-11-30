import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { User } from "../models/Users";
import { environment } from "src/environments/environment";
import { catchError, map, tap } from 'rxjs/operators';

const OAUTH_CLIENT = '59a9093f-9bed-4f7b-ac59-491dcd84040e';
const OAUTH_SECRET = '9ec0c21f-baa5-4652-afe9-8fb1e0cfb2a4';
//const API_URL = 'https://mdlaboratories.com/exacartapi/';
const API_URL = '/oauthserver/';
const Return_URL = 'https://localhost:4200/oauth/capture';
//api/token

const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: 'Basic ' + btoa(OAUTH_CLIENT + ':' + OAUTH_SECRET)
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
      return this.currentUserSubject.value;
  }

  private static handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

  oauthcall(): Observable<any> {

    var url = 'OAuth/Authorize?response_type=code&state=&client_id='+ OAUTH_CLIENT+ '&scope=&redirect_uri=' + Return_URL;
    return this.http.get<any>(API_URL + url)
      .pipe(
        tap(message => console.log(message)),
        catchError(AuthService.handleError)
      );
  }

  login(username: string, password: string) {
        // console.log("AuthenticationService: " + username + ", " + password)
        //TODO: call the login service here 
        
      return this.http.post<any>(`${environment.infotApiUrl}users/login`, { username, password })
          .pipe(map(user => {
              console.log('login successful');
              console.log(user);
              // login successful if there's a jwt token in the response
              
              //user && user.auth_token
              if (true) {
                console.log('storing user to local storage');
                user['username']=username;
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  localStorage.setItem('currentUser', JSON.stringify(user));
                  
                  this.currentUserSubject.next(user);
                  console.log('stored user to local storage');
              }
              return user;
          }));
          
  }

  logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }
  getJwtToken() {
    return localStorage.getItem('token');
  }
  saveJwtToken(token) {
    localStorage.setItem('token', token);
  }

  saveRefreshToken(refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }

  refresh(jwtToken) {
    console.log('refresh authentication function called.');
    return fetch('api/account/refresh', {
        method: 'POST',
        body: `token=${encodeURIComponent(jwtToken)}&refreshToken=${encodeURIComponent(this.getRefreshToken())}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
  }
}
