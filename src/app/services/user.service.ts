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

    return this.http.post<any>(environment.infotApiUrl + 'users', user)
      .pipe(map(data => {
        return data;
      }));
  }

  update(user :User){
    console.log("updateUsers: ");
    console.log(user);
 
    return this.http.put<any>(environment.infotApiUrl + 'users', user)
      .pipe(map(data => {
        return data;
      }));
  }
  loadData(): Observable<User[]> {

    return this.http.get<any>(`${environment.infotApiUrl}users`)
      .pipe(
        map(data => {
          var user: Array<User> = [];
          data.data.forEach(item => {
            user.push(<User>item);
          });
          return user;
        }),
      );
  }

  delete(id: number) {
    console.log("delete: " + id);
    var action = "users/" + id;
    return this.http.delete<any>(environment.infotApiUrl + action)
      .pipe(map(data => {
        return data;
      }));
  }

  handleError(operation: String) {
    return (err: any) => {
      let errMsg = `error in ${operation}() retrieving ${environment.infotApiUrl}`;
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
