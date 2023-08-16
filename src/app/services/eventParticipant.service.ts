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
export class eventParticipantService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  limit=10
  index=1

  loadParticipants(eventId:number,sort,search):Observable<EventParticipants[]>{
    return this.http.get<any>(`${environment.apiUrl}event/participants/?eventId=${eventId}&sort=${sort}&search=${search}&index=${this.index}&limit=${this.limit}`)
      .pipe(
        map(data => {
        //  console.log(data.data)
          const participantData = data.data;
          var eventParticipants: Array<EventParticipants> = [];
          
          if(participantData.length > 0){
            participantData.forEach(item => {
              eventParticipants.push(<EventParticipants>item);
            });
          }
      
          return eventParticipants;
        })
      );
  }
  
  loadNonParticipants(eventId:number,sort,search): Observable<EventParticipants[]> {
    return this.http.get<any>(`${environment.apiUrl}event/nonparticipants/?eventId=${eventId}&sort=${sort}&search=${search}&index=${this.index}&limit=${this.limit}`)
      .pipe(
        map(data => {
          const nonParticipantData = data.data;
          var eventNonParticipants: Array<EventParticipants> = [];
          
          if(nonParticipantData.length > 0){
            nonParticipantData.forEach(item => {
              eventNonParticipants.push(<EventParticipants>item);
            });
          }
      
        return eventNonParticipants;
      })
    );
  }

  addParticipants(eventParticipants:EventParticipants, applyOnRecursive:boolean) {
    return this.http.post<any>(`${environment.apiUrl}event/participants?applyOnRecursive=${applyOnRecursive}`,eventParticipants)
    .pipe(
      map(data => {
        return data;
      })
    );
  }

  updateParticipants(eventParticipants:EventParticipants) {
    return this.http.put<any>(`${environment.apiUrl}event/participants/`,eventParticipants)
    .pipe(
      map(data => {
        return data;
      })
    );
  }
  removeParticipants(eventParticipants,applyOnAllRecursive:boolean) {
    return this.http.delete<any>(`${environment.apiUrl}event/participants/${eventParticipants.eventId}/${eventParticipants.user.id}?applyOnRecursive=${applyOnAllRecursive}`)
    .pipe(
      map(data => {
        return data;
      })
    );
  }
}
