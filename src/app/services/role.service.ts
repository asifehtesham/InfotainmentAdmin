import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Roles } from "../models/Roles";
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  add(role: Roles) {
    console.log("addRoles: ");
    console.log(role);

    var action = (role.id <= 0) ? "role/add" : "role/edit"
    return this.http.post<any>(environment.apiUrl + action, role)
      .pipe(map(data => {
        return data;
      }));
  }


  loadByID(id: number): Observable<Roles> {
    console.log('loadByID' + id);
    return this.http.get<any>(`${environment.apiUrl}role/${id}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);

          console.log(<Roles>data);
          return <Roles>data;
        }),
      );
  }

  loadData(): Observable<Roles[]> {

    return this.http.get<any>(`${environment.apiUrl}role`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);

          var role: Array<Roles> = [];
          data.forEach(item => {
            role.push(<Roles>item);
          });

          console.log(role);
          return role;
        }),
      );
  }

  search(key: string): Observable<Roles[]> {
    return this.http.get<any>(`${environment.apiUrl}role/search/${key}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);

          var role = [];
          data.forEach(item => {
            //var cat = this.mapToRoles(item);
            role.push(<Roles>item);
          });

          console.log(role);
          return role;
        }),
      );
  }

  editactive(role: Roles) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.apiUrl + action, role)
      .pipe(map(data => {
        var roles = [];
        data.forEach(item => {
          //var role = this.mapToRoles(item);
          roles.push(<Roles>role);
        });

        return roles;
      }));
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "role/" + id;
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
