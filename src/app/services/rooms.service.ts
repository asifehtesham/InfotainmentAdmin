import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { Rooms } from '../models/Rooms';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  add(room: Rooms) {
    console.log(room)
    var action = 'rooms';
    return this.http.post<any>(environment.infotApiUrl + action, room)
      .pipe(map(data => {
        return data;
      }));
  }


  update(room: Rooms) {
    var action = 'rooms';
    return this.http.put<any>(environment.infotApiUrl + action, room)
      .pipe(map(data => {
        return data;
      }));
  }


  loadByID(id: number): Observable<Rooms> {
    return this.http.get<any>(`${environment.infotApiUrl}rooms/${id}`)
      .pipe(
        map(data => {
          return <Rooms>data;
        }),
      );
  }

  loadData(index: number = 1, limit: number = 10): Observable<Rooms[]> {

    return this.http.get<any>(`${environment.infotApiUrl}rooms?index=${index}&limit=${limit}`)
      .pipe(
        map(data => {
          // console.log(data)
          var room: Array<Rooms> = [];
          data.data.forEach(item => {
            room.push(<Rooms>item);
          });

          return room;
        }),
      );
  }

  search(key: string): Observable<Rooms[]> {
    return this.http.get<any>(`${environment.infotApiUrl}room/search/${key}`)
      .pipe(
        map(data => {
          var room = [];
          data.forEach(item => {
            //var cat = this.mapTorooms(item);
            room.push(<Rooms>item);
          });

          console.log(room);
          return room;
        }),
      );
  }

  editactive(room: Rooms) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.infotApiUrl + action, room)
      .pipe(map(data => {
        var rooms = [];
        data.forEach(item => {
          //var room = this.mapTorooms(item);
          rooms.push(<Rooms>room);
        });

        return rooms;
      }));
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "rooms/" + id;
    return this.http.delete<any>(environment.infotApiUrl + action)
      .pipe(map(data => {
        return data;
      }));
  }

  deleteAll(ids: string) {
    console.log("delete: " + ids);

    var action = "room?ids=" + ids;
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
