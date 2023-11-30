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
export class stationAssignedRoomsService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  loadIncludedRooms(stationId:number):Observable<any[]>{
    return this.http.get<any>(`${environment.infotApiUrl}nursingstation/getlinkedrooms/?nursingStationId=${stationId}`)
      .pipe(
        map(data => {
         console.log(data)
          const includedRoomsData = data.data;
          var includedRooms = [];
          
          if(includedRoomsData.length > 0){
            includedRoomsData.forEach(item => {
              includedRooms.push(item);
            });
          }
      
          return includedRooms;
        })
      );
  }
  
  loadNotIncludedRooms(stationId:number): Observable<any[]> {
    return this.http.get<any>(`${environment.infotApiUrl}nursingstation/getnonlinkedrooms/?nursingStationId=${stationId}`)
      .pipe(
        map(data => {
          console.log(data)
          const notInstalled = data.data;
          var notIncludedRooms = [];
          
          if(notInstalled.length > 0){
            notInstalled.forEach(item => {
              notIncludedRooms.push(item);
            });
          }
      
        return notIncludedRooms;
      })
    );
  }

  addRoom(roomData) {
    return this.http.post<any>(`${environment.infotApiUrl}nursingstation/add_room_to_station?NursingStationId=${roomData.stationId}&roomNo=${roomData.roomNo}`,roomData)
    .pipe(
      map(data => { 
        return data;
      })
    );
  }
  removeRooms(stationId,roomData) {
    return this.http.delete<any>(`${environment.infotApiUrl}nursingstation/remove_room_to_station?NursingStationId=${stationId}&roomNo=${roomData.roomNo}`)
    .pipe(
      map(data => {
        return data;
      })
    );
  }
}
