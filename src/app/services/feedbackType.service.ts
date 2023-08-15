import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { FeedbackType } from '../models/FeedbackType';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FeedbackTypeService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  add(feedbackType: FeedbackType) {
    var action = 'feedbackType';
    return this.http.post<any>(environment.apiUrl + action, feedbackType)
      .pipe(map(data => {
        return data;
      }));
  }


  update(feedbackType: FeedbackType) {
    var action = 'feedbackType';
    return this.http.put<any>(environment.apiUrl + action, feedbackType)
      .pipe(map(data => {

        console.log("data ......................+++", data)
        return data;
      }));
  }


  loadByID(id: number): Observable<FeedbackType> {
    return this.http.get<any>(`${environment.apiUrl}feedbackType/${id}`)
      .pipe(
        map(data => {
          return <FeedbackType>data;
        }),
      );
  }

  loadData(index: number = 1, limit: number = 10): Observable<FeedbackType[]> {

    return this.http.get<any>(`${environment.apiUrl}feedbackType?index=${index}&limit=${limit}`)
      .pipe(
        map(data => {
          var feedbackType: Array<FeedbackType> = [];
          data.data.forEach(item => {
            feedbackType.push(<FeedbackType>item);
          });

          return feedbackType;
        }),
      );
  }

  search(key: string): Observable<FeedbackType[]> {
    return this.http.get<any>(`${environment.apiUrl}feedbackType/search/${key}`)
      .pipe(
        map(data => {
          var feedbackType = [];
          data.forEach(item => {
            //var cat = this.mapToFeedbackTypes(item);
            feedbackType.push(<FeedbackType>item);
          });

          console.log(feedbackType);
          return feedbackType;
        }),
      );
  }

  editactive(feedbackType: FeedbackType) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.apiUrl + action, feedbackType)
      .pipe(map(data => {
        var feedbackTypes = [];
        data.forEach(item => {
          //var feedbackType = this.mapToFeedbackTypes(item);
          feedbackTypes.push(<FeedbackType>feedbackType);
        });

        return feedbackTypes;
      }));
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "feedbackType/" + id;
    return this.http.delete<any>(environment.apiUrl + action)
      .pipe(map(data => {
        return data;
      }));
  }

  deleteAll(ids: string) {
    console.log("delete: " + ids);

    var action = "feedbackType?ids=" + ids;
    return this.http.delete<any>(environment.apiUrl + action)
      .pipe(map(data => {
        return data;
      }));
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
        console.log("refreshResponse");
        console.log(refreshResponse);
      }
    }
  }
}
