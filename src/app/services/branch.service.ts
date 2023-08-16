import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { Branch } from '../models/Branch';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  add(branch: Branch) {
    var action = 'branch';
    return this.http.post<any>(environment.apiUrl + action, branch)
      .pipe(map(data => {
        return data;
      }));
  }


  update(branch: Branch) {
    var action = 'branch';
    return this.http.put<any>(environment.apiUrl + action, branch)
      .pipe(map(data => {

        console.log("data ......................+++", data)
        return data;
      }));
  }


  loadByID(id: number): Observable<Branch> {
    return this.http.get<any>(`${environment.apiUrl}branch/${id}`)
      .pipe(
        map(data => {
          return <Branch>data;
        }),
      );
  }

  loadData(index: number = 1, limit: number = 10): Observable<Branch[]> {

    return this.http.get<any>(`${environment.apiUrl}branch?index=${index}&limit=${limit}`)
      .pipe(
        map(data => {
          var branch: Array<Branch> = [];
          data.data.forEach(item => {
            branch.push(<Branch>item);
          });

          return branch;
        }),
      );
  }

  search(key: string): Observable<Branch[]> {
    return this.http.get<any>(`${environment.apiUrl}branch/search/${key}`)
      .pipe(
        map(data => {
          var branch = [];
          data.forEach(item => {
            //var cat = this.mapTobranchs(item);
            branch.push(<Branch>item);
          });

          console.log(branch);
          return branch;
        }),
      );
  }

  editactive(branch: Branch) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.apiUrl + action, branch)
      .pipe(map(data => {
        var branchs = [];
        data.forEach(item => {
          //var branch = this.mapTobranchs(item);
          branchs.push(<Branch>branch);
        });

        return branchs;
      }));
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "branch/" + id;
    return this.http.delete<any>(environment.apiUrl + action)
      .pipe(map(data => {
        return data;
      }));
  }

  deleteAll(ids: string) {
    console.log("delete: " + ids);

    var action = "branch?ids=" + ids;
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
