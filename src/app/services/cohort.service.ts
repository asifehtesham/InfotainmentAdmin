import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from "../models/Users";
import { Cohort } from "../models/Cohort";
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class CohortService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  add(cohort: Cohort) {
    console.log("addcohorts: ");
    console.log(cohort);

    var action = (cohort.id <= 0) ? "cohort/add" : "cohort/edit"
    return this.http.post<any>(environment.apiUrl + action, cohort)
      .pipe(map(data => {
        return data;
      }));
  }

  deleteAll(ids) {
    console.log("delete: " + ids);

    // var action = "blogs/" + ids;
    return this.http.request<any>('delete',environment.apiUrl + "delete-all", {body:ids})
      .pipe(map(data => {
       
        Swal.fire(
          'Deleted!',
          'Your cohort has been deleted.',
          'success'
        )
        return data;
      }));
  }

  loadByID(id: number): Observable<Cohort> {
    console.log('loadByID' + id);
    return this.http.get<any>(`${environment.apiUrl}cohort/${id}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);

          console.log(<Cohort>data);
          return <Cohort>data;
        }),
      );
  }

  loadData(): Observable<Cohort[]> {

    return this.http.get<any>(`${environment.apiUrl}cohort`)
      .pipe(
        map(data => {
          var cohort: Array<Cohort> = [];          
          data.forEach(item => {
            cohort.push(<Cohort>item);
          });
          console.log(cohort);
          return cohort;
        }),
      );
  }

  delete(id: number) {
    console.log("delete: " + id);
    var action = "user/" + id;
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
