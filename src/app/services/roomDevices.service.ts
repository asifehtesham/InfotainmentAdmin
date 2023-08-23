import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from "../models/Users";
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { Events } from '../models/Events';
import { EventParticipants } from '../models/eventParticipants';
import { RecurrenceEvent } from '../models/RecurrenceEvent';
import Swal from "sweetalert2";
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root'
})
export class roomDevicesService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  limit=10
  index=1

  loadInstalledDevices(roomId:number,sort,search):Observable<any[]>{
    return this.http.get<any>(`${environment.infotApiUrl}rooms/device_by_id/?roomId=${roomId}&sort=${sort}&search=${search}&index=${this.index}&limit=${this.limit}`)
      .pipe(
        map(data => {
        //  console.log(data.data)
          const installedDevicesData = data.data;
          var roomDevice = [];
          
          if(installedDevicesData.length > 0){
            installedDevicesData.forEach(item => {
              roomDevice.push(item);
            });
          }
      
          return roomDevice;
        })
      );
  }
  
  loadNotInstalledDevices(roomId:number,sort,search): Observable<any[]> {
    return this.http.get<any>(`${environment.infotApiUrl}rooms/device_not_installed_by_id/?roomId=${roomId}&sort=${sort}&search=${search}&index=${this.index}&limit=${this.limit}`)
      .pipe(
        map(data => {
          const notInstalledDevices = data.data;
          var notInstalledRoomDevices = [];
          
          if(notInstalledDevices.length > 0){
            notInstalledDevices.forEach(item => {
              notInstalledRoomDevices.push(item);
            });
          }
      
        return notInstalledRoomDevices;
      })
    );
  }

  addDevice(deviceData) {
    return this.http.post<any>(`${environment.infotApiUrl}rooms/device?roomId=${deviceData.roomId}&deviceId=${deviceData.deviceId}`, deviceData)
    .pipe(
      map(data => { 
        return data;
      })
    );
  }

  updateParticipants(deviceData) {
    return this.http.put<any>(`${environment.apiUrl}event/participants/`,deviceData)
    .pipe(
      map(data => {
        return data;
      })
    );
  }
  removeDevics(roomId,deviceData) {
    return this.http.delete<any>(`${environment.infotApiUrl}rooms/device?roomId=${roomId}&deviceId=${deviceData.id}`)
    .pipe(
      map(data => {
        return data;
      })
    );
  }
}
