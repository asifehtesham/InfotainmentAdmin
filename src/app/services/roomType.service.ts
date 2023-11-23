import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from "../models/Users";
import { RoomType } from "../models/RoomType";
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class RoomTypeService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  add(roomtype: RoomType) {
    console.log("addroomtypes: ");
    console.log(roomtype);
    return this.http.post<any>(environment.infotApiUrl + "roomtype", roomtype)
      .pipe(map(data => {
        return data;
      }));
  }
  
  edit(roomtype: RoomType) {
    console.log("updateroomtypes: ");
    console.log(roomtype);
    return this.http.put<any>(environment.infotApiUrl + "roomtype", roomtype)
      .pipe(map((data: RoomType) => {
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
          'Your Room Type has been deleted.',
          'success'
        )
        return data;
      }));
  }

  loadData(): Observable<RoomType[]> {
    return this.http.get<any>(`${environment.infotApiUrl}roomtype`)
      .pipe(
        map(data => {
          var roomtype: Array<RoomType> = [];          
          data.data.forEach(item => {
            roomtype.push(<RoomType>item);
          });
          console.log(roomtype);
          return roomtype;
        }),
      );
  }

  delete(id: number) {
    console.log("delete: " + id);
    var action = "roomtype/" + id;
    return this.http.delete<any>(environment.infotApiUrl + action)
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
