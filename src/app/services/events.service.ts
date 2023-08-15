import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from "../models/Users";
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { Events } from '../models/Events';
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
    console.log("mapping:");
    console.log(DateTime.fromISO(data.startDate));
    var event: Events = {
      id: data.id,
      Image: data.Image,
      title: data.title,
      description: data.description,
      color: data.color,
      allDay: data.allDay,
      startDate: DateTime.fromISO(data.startDate),
      endDate: DateTime.fromISO(data.endDate),
      isPublish: data.isPublish,
      CreateDate: data.CreateDate,
      LastEditDate: data.LastEditDate,
      CreatedBy: data.CreatedBy,
      LastEditBy: data.LastEditBy,
      IsActive: data.IsActive,
    };
    return event;
  }

  add(events: Events) {
    console.log("addEventss: ");
    console.log(events);

    //var action = (events.ID <= 0) ? "events/add" : "events/edit"
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

  loadData(index: number = 1, limit: number = 10): Observable<Events[]> {

    return this.http.get<any>(`${environment.apiUrl}event?index=${index}&limit=${limit}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);
          console.log(data.data);

          var events: Array<Events> = data.data.map(x => this.map(x));
          // var events: Array<Events> = [];
          // data.data.forEach(item => {
          //   events.push(<Events>item);
          // });

          console.log(events);
          return events;
        }),
      );
  }

  search(key: string): Observable<Events[]> {
    return this.http.get<any>(`${environment.apiUrl}event/search/${key}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);

          var events: Array<Events> = data.data.map(x => this.map(x));
          //var events = [];
          // data.forEach(item => {
          //   //var cat = this.mapToEventss(item);
          //   events.push(<Events>item);
          // });

          console.log(events);
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
        return data;
      }));
  }

  // handleError(operation: String) {
  //   return (err: any) => {
  //     let errMsg = `error in ${operation}() retrieving ${environment.apiUrl}`;
  //     console.log(`${errMsg}:`, err)
  //     if (err instanceof HttpErrorResponse) {
  //       // you could extract more info about the error if you want, e.g.:
  //       console.log(`status: ${err.status}, ${err.statusText}`);

  //       var refreshToken = this.authenticationService.getRefreshToken();

  //       var jwtToken = this.authenticationService.currentUserValue.auth_token;
  //       var refreshResponse = this.authenticationService.refresh(jwtToken).then(x => {

  //       });
  //       console.log("refreshResponse");
  //       console.log(refreshResponse);
  //     }
  //   }
  // }
}
