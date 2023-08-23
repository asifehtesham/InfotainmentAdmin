import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from "../models/Users";
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { RoomService } from '../models/RoomService';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RoomServiceService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  add(service: RoomService) {
    var action = 'service';
    return this.http.post<any>(environment.infotApiUrl + action, service)
      .pipe(map(data => {
        return data;
      }));
  }


  update(service: RoomService) {
    var action = 'service';
    return this.http.put<any>(environment.infotApiUrl + action, service)
      .pipe(map(data => {

        console.log("data ......................+++", data)
        return data;
      }));
  }


  loadByID(id: number): Observable<RoomService> {
    return this.http.get<any>(`${environment.infotApiUrl}service/${id}`)
      .pipe(
        map(data => {
          return <RoomService>data;
        }),
      );
  }

  loadData(index: number = 1, limit: number = 10): Observable<RoomService[]> {

    return this.http.get<any>(`${environment.infotApiUrl}service?index=${index}&limit=${limit}`)
      .pipe(
        map(data => {
          var service: Array<RoomService> = [];
          data.data.forEach(item => {
            service.push(<RoomService>item);
          });

          return service;
        }),
      );
  }

  search(key: string): Observable<RoomService[]> {
    return this.http.get<any>(`${environment.infotApiUrl}service/search/${key}`)
      .pipe(
        map(data => {
          var service = [];
          data.forEach(item => {
            //var cat = this.mapToRoomServices(item);
            service.push(<RoomService>item);
          });

          console.log(service);
          return service;
        }),
      );
  }

  editactive(service: RoomService) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.infotApiUrl + action, service)
      .pipe(map(data => {
        var services = [];
        data.forEach(item => {
          //var service = this.mapToRoomServices(item);
          services.push(<RoomService>service);
        });

        return services;
      }));
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "service/" + id;
    return this.http.delete<any>(environment.infotApiUrl + action)
      .pipe(map(data => {
        return data;
      }));
  }

  deleteAll(ids: string) {
    console.log("delete: " + ids);

    var action = "service?ids=" + ids;
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
