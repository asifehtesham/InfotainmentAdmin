import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { NursingStation } from '../models/NursingStation';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class nursingStationService {

  constructor(private http: HttpClient, private authenticationService: AuthService, private snakbar: MatSnackBar,
  ) { }

  add(nursingStation: NursingStation) {
    console.log("Post nursingstation", nursingStation)
    var action = 'nursingstation';
    return this.http.post<any>(environment.infotApiUrl + action, nursingStation)
      .pipe(map(data => {
        return data;
      }));
  }


  update(nursingStation: NursingStation) {
    var action = 'nursingstation';
    return this.http.put<any>(environment.infotApiUrl + action, nursingStation)
      .pipe(map(data => {
        return data;
      }));
  }
  loadData(index: number = 1, limit: number = 10): Observable<NursingStation[]> {

    return this.http.get<any>(`${environment.infotApiUrl}nursingstation?index=${index}&limit=${limit}`)
      .pipe(
        map(data => {
          var nursingStation: Array<NursingStation> = [];
          data.data.forEach(item => {
            nursingStation.push(<NursingStation>item);
          });

          return nursingStation;
        }),
      );
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "nursingstation/" + id;
    return this.http.delete<any>(environment.infotApiUrl + action)
      .pipe(map(data => {
        return data;
      }));
  }

  deleteAll(ids: string) {
    console.log("delete: " + ids);

    var action = "nursingstation?ids=" + ids;
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
