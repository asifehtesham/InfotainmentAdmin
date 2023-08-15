import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { Magazine } from '../models/Magazine';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MagazineService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  add(magazine: Magazine) {
    var action = 'magazine';
    return this.http.post<any>(environment.apiUrl + action, magazine)
      .pipe(map(data => {
        return data;
      }));
  }


  update(magazine: Magazine) {
    var action = 'magazine';
    return this.http.put<any>(environment.apiUrl + action, magazine)
      .pipe(map(data => {

        console.log("data ......................+++", data)
        return data;
      }));
  }


  loadByID(id: number): Observable<Magazine> {
    return this.http.get<any>(`${environment.apiUrl}magazine/${id}`)
      .pipe(
        map(data => {
          return <Magazine>data;
        }),
      );
  }

  loadData(index: number = 1, limit: number = 10): Observable<Magazine[]> {

    return this.http.get<any>(`${environment.apiUrl}magazine?index=${index}&limit=${limit}`)
      .pipe(
        map(data => {
          var magazine: Array<Magazine> = [];
          data.data.forEach(item => {
            magazine.push(<Magazine>item);
          });

          return magazine;
        }),
      );
  }

  search(key: string): Observable<Magazine[]> {
    return this.http.get<any>(`${environment.apiUrl}magazine/search/${key}`)
      .pipe(
        map(data => {
          var magazine = [];
          data.forEach(item => {
            //var cat = this.mapToMagazines(item);
            magazine.push(<Magazine>item);
          });

          console.log(magazine);
          return magazine;
        }),
      );
  }

  editactive(magazine: Magazine) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.apiUrl + action, magazine)
      .pipe(map(data => {
        var magazines = [];
        data.forEach(item => {
          //var magazine = this.mapToMagazines(item);
          magazines.push(<Magazine>magazine);
        });

        return magazines;
      }));
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "magazine/" + id;
    return this.http.delete<any>(environment.apiUrl + action)
      .pipe(map(data => {
        return data;
      }));
  }

  deleteAll(ids: string) {
    console.log("delete: " + ids);

    var action = "magazine?ids=" + ids;
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
