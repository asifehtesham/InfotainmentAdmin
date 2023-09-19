import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { Device } from '../models/Device';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  add(device: Device) {
    var action = 'devices';
    return this.http.post<any>(environment.infotApiUrl + action, device)
      .pipe(map(data => {
        return data;
      }));
  }


  update(device: Device) {
    var action = 'devices';
    return this.http.put<any>(environment.infotApiUrl + action, device)
      .pipe(map(data => {

        console.log("data ......................+++", data)
        return data;
      }));
  }


  loadByID(id: number): Observable<Device> {
    return this.http.get<any>(`${environment.infotApiUrl}devices/${id}`)
      .pipe(
        map(data => {
          return <Device>data;
        }),
      );
  }

  loadData(index: number = 1, limit: number = 10): Observable<Device[]> {

    return this.http.get<any>(`${environment.infotApiUrl}devices?index=${index}&limit=${limit}`)
      .pipe(
        map(data => {
          var device: Array<Device> = [];
          data.data.forEach(item => {
            device.push(<Device>item);
          });

          return device;
        }),
      );
  }

  search(key: string): Observable<Device[]> {
    return this.http.get<any>(`${environment.infotApiUrl}devices/search/${key}`)
      .pipe(
        map(data => {
          var device = [];
          data.forEach(item => {
            //var cat = this.mapTodevices(item);
            device.push(<Device>item);
          });

          console.log(device);
          return device;
        }),
      );
  }

  editactive(device: Device) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.infotApiUrl + action, device)
      .pipe(map(data => {
        var devices = [];
        data.forEach(item => {
          //var device = this.mapTodevices(item);
          devices.push(<Device>device);
        });

        return devices;
      }));
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "devices/" + id;
    return this.http.delete<any>(environment.infotApiUrl + action)
      .pipe(map(data => {
        return data;
      }));
  }

  deleteAll(ids: string) {
    console.log("delete: " + ids);

    var action = "devices?ids=" + ids;
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
