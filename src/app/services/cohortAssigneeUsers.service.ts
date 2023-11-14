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
export class cohortAssigneeUsersService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  limit=10
  index=1

  loadCohortUsers(cohortId:number,sort,search):Observable<any[]>{
    return this.http.get<any>(`${environment.infotApiUrl}cohort/users_by_id/?cohortId=${cohortId}&sort=${sort}&search=${search}&index=${this.index}&limit=${this.limit}`)
      .pipe(
        map(data => {
        //  console.log(data.data)
          const installedDevicesData = data.data;
          var cohortUser = [];
          
          if(installedDevicesData.length > 0){
            installedDevicesData.forEach(item => {
              cohortUser.push(item);
            });
          }
      
          return cohortUser;
        })
      );
  }
  
  loadNonCohortUsers(cohortId:number,sort,search): Observable<any[]> {
    return this.http.get<any>(`${environment.infotApiUrl}cohort/users_not_linked_by_id/?cohortId=${cohortId}&sort=${sort}&search=${search}&index=${this.index}&limit=${this.limit}`)
      .pipe(
        map(data => {
          const notInstalledUsers = data.data;
          var notInstalledCohortUsers = [];
          
          if(notInstalledUsers.length > 0){
            notInstalledUsers.forEach(item => {
              notInstalledCohortUsers.push(item);
            });
          }
      
        return notInstalledCohortUsers;
      })
    );
  }

  addUser(cohortData) {
    return this.http.post<any>(`${environment.infotApiUrl}cohort/cohortuser?cohortId=${cohortData.cohortId}&userId=${cohortData.userId}`, cohortData)
    .pipe(
      map(data => { 
        return data;
      })
    );
  }

  updateParticipants(cohortData) {
    return this.http.put<any>(`${environment.apiUrl}event/participants/`,cohortData)
    .pipe(
      map(data => {
        return data;
      })
    );
  }
  removeUser(cohortId,cohortData) {
    return this.http.delete<any>(`${environment.infotApiUrl}cohort/cohortusers?cohortId=${cohortId}&userId=${cohortData.id}`)
    .pipe(
      map(data => {
        return data;
      })
    );
  }
}
