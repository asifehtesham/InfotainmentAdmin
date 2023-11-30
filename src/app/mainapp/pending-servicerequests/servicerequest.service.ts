import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
// import { AuthService } from '/auth-service.service';
import { JsonPipe } from '@angular/common';
import { AuthService } from 'src/app/services/auth-service.service';
import { Servicerequest } from 'src/app/models/Servicerequest';

@Injectable({
  providedIn: 'root'
})
export class ServicerequestService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  add(servicerequest: Servicerequest) {
    var action = 'serviceRequest_request';
    return this.http.post<any>(environment.infotApiUrl + action, servicerequest)
      .pipe(map(data => {
        return data;
      }));
  }


  update(servicerequest: Servicerequest) {
    var action = 'serviceRequest_request';
    return this.http.put<any>(environment.infotApiUrl + action, servicerequest)
      .pipe(map(data => {

        console.log("data ......................+++", data)
        return data;
      }));
  }


  loadByID(id: number): Observable<Servicerequest> {
    return this.http.get<any>(`${environment.infotApiUrl}serviceRequest_request/${id}`)
      .pipe(
        map(data => {
          return <Servicerequest>data;
        }),
      );
  }

  loadData(index: number = 1, limit: number = 10): Observable<Servicerequest[]> {

    return this.http.get<any>(`${environment.infotApiUrl}serviceRequest_request?index=${index}&limit=${limit}`)
      .pipe(
        map(data => {
          var servicerequest: Array<Servicerequest> = [];
          data.data.forEach(item => {
            servicerequest.push(<Servicerequest>item);
          });

          return servicerequest;
        }),
      );
  }

  search(key: string): Observable<Servicerequest[]> {
    return this.http.get<any>(`${environment.infotApiUrl}serviceRequest_request/search/${key}`)
      .pipe(
        map(data => {
          var servicerequest = [];
          data.forEach(item => {
            //var cat = this.mapToservicerequests(item);
            servicerequest.push(<Servicerequest>item);
          });

          console.log(servicerequest);
          return servicerequest;
        }),
      );
  }

  editactive(servicerequest: Servicerequest) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.infotApiUrl + action, servicerequest)
      .pipe(map(data => {
        var servicerequests = [];
        data.forEach(item => {
          //var servicerequest = this.mapToservicerequests(item);
          servicerequests.push(<Servicerequest>servicerequest);
        });

        return servicerequests;
      }));
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "serviceRequest_request/" + id;
    return this.http.delete<any>(environment.infotApiUrl + action)
      .pipe(map(data => {
        return data;
      }));
  }

  deleteAll(ids: string) {
    console.log("delete: " + ids);

    var action = "serviceRequest_request?ids=" + ids;
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
