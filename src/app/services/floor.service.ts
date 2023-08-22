import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { Floor } from '../models/Floor';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FloorService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  add(floor: Floor) {
    var action = 'floor';
    return this.http.post<any>(environment.infotApiUrl + action, floor)
      .pipe(map(data => {
        return data;
      }));
  }


  update(floor: Floor) {
    var action = 'floor';
    return this.http.put<any>(environment.infotApiUrl + action, floor)
      .pipe(map(data => {

        console.log("data ......................+++", data)
        return data;
      }));
  }


  loadByID(id: number): Observable<Floor> {
    return this.http.get<any>(`${environment.infotApiUrl}floor/${id}`)
      .pipe(
        map(data => {
          return <Floor>data;
        }),
      );
  }

  loadData(index: number = 1, limit: number = 10): Observable<Floor[]> {

    return this.http.get<any>(`${environment.infotApiUrl}floor?index=${index}&limit=${limit}`)
      .pipe(
        map(data => {
          var floor: Array<Floor> = [];
          data.data.forEach(item => {
            floor.push(<Floor>item);
          });

          return floor;
        }),
      );
  }

  search(key: string): Observable<Floor[]> {
    return this.http.get<any>(`${environment.infotApiUrl}floor/search/${key}`)
      .pipe(
        map(data => {
          var floor = [];
          data.forEach(item => {
            //var cat = this.mapTofloors(item);
            floor.push(<Floor>item);
          });

          console.log(floor);
          return floor;
        }),
      );
  }

  editactive(floor: Floor) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.infotApiUrl + action, floor)
      .pipe(map(data => {
        var floors = [];
        data.forEach(item => {
          //var floor = this.mapTofloors(item);
          floors.push(<Floor>floor);
        });

        return floors;
      }));
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "floor/" + id;
    return this.http.delete<any>(environment.infotApiUrl + action)
      .pipe(map(data => {
        return data;
      }));
  }

  deleteAll(ids: string) {
    console.log("delete: " + ids);

    var action = "floor?ids=" + ids;
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
