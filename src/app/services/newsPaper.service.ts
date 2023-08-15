import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { NewsPaper } from '../models/NewsPaper';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NewsPaperService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  add(newsPaper: NewsPaper) {
    var action = 'newsPaper';
    return this.http.post<any>(environment.apiUrl + action, newsPaper)
      .pipe(map(data => {
        return data;
      }));
  }


  update(newsPaper: NewsPaper) {
    var action = 'newsPaper';
    return this.http.put<any>(environment.apiUrl + action, newsPaper)
      .pipe(map(data => {

        console.log("data ......................+++", data)
        return data;
      }));
  }


  loadByID(id: number): Observable<NewsPaper> {
    return this.http.get<any>(`${environment.apiUrl}newsPaper/${id}`)
      .pipe(
        map(data => {
          return <NewsPaper>data;
        }),
      );
  }

  loadData(index: number = 1, limit: number = 10): Observable<NewsPaper[]> {

    return this.http.get<any>(`${environment.apiUrl}newsPaper?index=${index}&limit=${limit}`)
      .pipe(
        map(data => {
          var newsPaper: Array<NewsPaper> = [];
          data.data.forEach(item => {
            newsPaper.push(<NewsPaper>item);
          });

          return newsPaper;
        }),
      );
  }

  search(key: string): Observable<NewsPaper[]> {
    return this.http.get<any>(`${environment.apiUrl}newsPaper/search/${key}`)
      .pipe(
        map(data => {
          var newsPaper = [];
          data.forEach(item => {
            //var cat = this.mapToNewsPapers(item);
            newsPaper.push(<NewsPaper>item);
          });

          console.log(newsPaper);
          return newsPaper;
        }),
      );
  }

  editactive(newsPaper: NewsPaper) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.apiUrl + action, newsPaper)
      .pipe(map(data => {
        var newsPapers = [];
        data.forEach(item => {
          //var newsPaper = this.mapToNewsPapers(item);
          newsPapers.push(<NewsPaper>newsPaper);
        });

        return newsPapers;
      }));
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "newsPaper/" + id;
    return this.http.delete<any>(environment.apiUrl + action)
      .pipe(map(data => {
        return data;
      }));
  }

  deleteAll(ids: string) {
    console.log("delete: " + ids);

    var action = "newsPaper?ids=" + ids;
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
