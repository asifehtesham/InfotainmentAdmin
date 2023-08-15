import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from "../models/Users";
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  add(user: User) {
    console.log("addUsers: ");
    console.log(user);

    var action = (user.id <= 0) ? "user/add" : "user/edit"
    return this.http.post<any>(environment.apiUrl + action, user)
      .pipe(map(data => {
        return data;
      }));
  }


  loadByID(id: number): Observable<User> {
    console.log('loadByID' + id);
    return this.http.get<any>(`${environment.apiUrl}user/${id}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);

          console.log(<User>data);
          return <User>data;
        }),
      );
  }

  loadData(): Observable<User[]> {

    return this.http.get<any>(`${environment.apiUrl}user`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);

          var user: Array<User> = [];
          data.forEach(item => {
            user.push(<User>item);
          });

          console.log(user);
          return user;
        }),
      );
  }

  search(key: string): Observable<User[]> {
    return this.http.get<any>(`${environment.apiUrl}user/search/${key}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);

          var user = [];
          data.forEach(item => {
            //var cat = this.mapToUsers(item);
            user.push(<User>item);
          });

          console.log(user);
          return user;
        }),
      );
  }

  editactive(user: User) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.apiUrl + action, user)
      .pipe(map(data => {
        var users = [];
        data.forEach(item => {
          //var user = this.mapToUsers(item);
          users.push(<User>user);
        });

        return users;
      }));
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
