import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from "../models/Users";
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { Events } from '../models/Events';
import { RecurrenceEvent } from '../models/RecurrenceEvent';
import Swal from "sweetalert2";
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }


  map(data: any) {
   
    var event: Events = {
      id: data.id, 
      title: data.title,
      description: data.description,
      color: data.color,
      galleyId:data.galleyId,
      status:data.status,
      location_URL:data.location_URL,
      organizer:data.organizer,
      allDay: data.allDay,
      isPublic:data.isPublic,
      startDate: DateTime.fromISO(data.startDate),
      endDate: DateTime.fromISO(data.endDate),
      parentEventId: data.parentEventId,
      invitedUsers: data.invitedUsers,
      isRecursive: data.isRecursive,
      CreateDate: data.CreateDate,
      LastEditDate: data.LastEditDate,
      CreatedBy: data.CreatedBy,
      LastEditBy: data.LastEditBy,
      IsActive: data.IsActive,
    };
    return event;
  }

  add(events: Events) {
    console.log("addEventss:",events);
 
    return this.http.post<any>(environment.apiUrl + "event", events)
      .pipe(map((data: Events) => {
        return data;
      }));
  }

  edit(events: Events) {
    console.log("addEventss: ");
    console.log(events);

    //var action = (events.ID <= 0) ? "events/add" : "events/edit"
    return this.http.put<any>(environment.apiUrl + "event", events)
      .pipe(map((data: Events) => {
        return data;
      }));
  }
  recurrenceAddEvents(recurrenceEvent:RecurrenceEvent){
    console.log("recurrenceEvent",recurrenceEvent);
    
    return this.http.post<any>(environment.apiUrl + "event/recurrence", recurrenceEvent)
    .pipe(map((data: RecurrenceEvent) => {
      return data;
    }));
  }
  recurrenceEditEvents(recurrenceEvent:RecurrenceEvent){
    console.log(recurrenceEvent);
    return this.http.put<any>(environment.apiUrl + "event", recurrenceEvent)
      .pipe(map((data: RecurrenceEvent) => {
        return data;
      }));
  }
  loadByID(id: number): Observable<Events> {
    console.log('loadByID' + id);
    return this.http.get<any>(`${environment.apiUrl}event/${id}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);

          console.log(this.map(data));
          return this.map(data);
        }),
      );
  }

  loadData(start,end): Observable<Events[]> {
   
    return this.http.get<any>(`${environment.apiUrl}event/bydate/?start=${start}&end=${end}`)
    // return this.http.get<any>(`${environment.apiUrl}event`)
      .pipe(
        map(data => {
          var events: Array<Events> = data.data.map(x => this.map(x));
          return events;
        }),
      );
  }

  search(key: string): Observable<Events[]> {
    return this.http.get<any>(`${environment.apiUrl}event/search/${key}`)
      .pipe(
        map(data => {
          
          var events: Array<Events> = data.data.map(x => this.map(x));
          //var events = [];
          // data.forEach(item => {
          //   //var cat = this.mapToEventss(item);
          //   events.push(<Events>item);
          // });
 
          return events;
        }),
      );
  }

  editactive(events: Events) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.apiUrl + action, events)
      .pipe(map(data => {
        var eventss = [];
        data.forEach(item => {
          //var events = this.mapToEventss(item);
          eventss.push(<Events>events);
        });

        return eventss;
      }));
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "event/" + id;
    return this.http.delete<any>(environment.apiUrl + action)
      .pipe(map(data => {
        Swal.fire(
          'Deleted!',
          'Your event has been deleted.',
          'success'
        )
        return data;
      }));
  }
  deleteRecurrence(id:number){
    console.log("delete: " + id);

    var action = "event/recurrence/" + id;
    return this.http.delete<any>(environment.apiUrl + action)
      .pipe(map(data => {
        Swal.fire(
          'Deleted!',
          'Event with all recurrence has been deleted.',
          'success'
        )
        return data;
      }));
  }
}
