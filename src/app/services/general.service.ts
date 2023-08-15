import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from "../models/Users";
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { Quiz } from '../models/Quiz';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';
import { Questions } from '../models/Questions';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private http: HttpClient, private authenticationService: AuthService) { }

  loadLanguages(): Observable<any[]> {
    console.log("Load language call");
    return this.http.get<any>(`${environment.apiUrl}general/languages`)
      .pipe(
        map(data => {
          return data;
        }),
      );
    // .pipe(
    //   map(data => {
    //     console.log("Load language data");
    //     console.log(data);
    //     return data;
    //   }),
    //   //catchError(this.handleError("getQuiz"))
    // );
  }

  loadLevel(): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}general/levels`)
      .pipe(
        map(data => {
          return data;
        }),
        //catchError(this.handleError("getQuiz"))
      );
  }


  topicTypes(): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}general/topicTypes`)
      .pipe(
        map(data => {
          return data;
        }),
        //catchError(this.handleError("getQuiz"))
      );
  }



  enrolmentTypes(): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}general/enrolmentTypes`)
      .pipe(
        map(data => {
          return data;
        }),
        //catchError(this.handleError("getQuiz"))
      );
  }

  questionTypes(): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}general/questionTypes`)
      .pipe(
        map(data => {
          return data;
        }),
        //catchError(this.handleError("getQuiz"))
      );
  }
  handleError(operation: String) {
    return (err: any) => {
      let errMsg = `error in ${operation}() retrieving ${environment.apiUrl}`;
      console.log(`${errMsg}:`, err)
      if (err instanceof HttpErrorResponse) {
        // you could extract more info about the error if you want, e.g.:
        console.log(`status: ${err.status}, ${err.statusText}`);

        var refreshToken = this.authenticationService.getRefreshToken();

        var jwtToken = this.authenticationService.currentUserValue.auth_token;
        var refreshResponse = this.authenticationService.refresh(jwtToken).then(x => {

        });

      }
    }
  }
}
