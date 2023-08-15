import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { IPTV } from '../models/IPTV';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class IPTVService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  add(iptv: IPTV) {
    var action = 'iptv';
    return this.http.post<any>(environment.apiUrl + action, iptv)
      .pipe(map(data => {
        return data;
      }));
  }


  update(iptv: IPTV) {
    var action = 'iptv';
    return this.http.put<any>(environment.apiUrl + action, iptv)
      .pipe(map(data => {

        console.log("data ......................+++", data)
        return data;
      }));
  }


  loadByID(id: number): Observable<IPTV> {
    return this.http.get<any>(`${environment.apiUrl}iptv/${id}`)
      .pipe(
        map(data => {
          return <IPTV>data;
        }),
      );
  }

  loadData(index: number = 1, limit: number = 10): Observable<IPTV[]> {

    return this.http.get<any>(`${environment.apiUrl}iptv?index=${index}&limit=${limit}`)
      .pipe(
        map(data => {
          var iptv: Array<IPTV> = [];
          data.data.forEach(item => {
            iptv.push(<IPTV>item);
          });

          return iptv;
        }),
      );
  }

  search(key: string): Observable<IPTV[]> {
    return this.http.get<any>(`${environment.apiUrl}iptv/search/${key}`)
      .pipe(
        map(data => {
          var iptv = [];
          data.forEach(item => {
            //var cat = this.mapToIPTVs(item);
            iptv.push(<IPTV>item);
          });

          console.log(iptv);
          return iptv;
        }),
      );
  }

  editactive(iptv: IPTV) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.apiUrl + action, iptv)
      .pipe(map(data => {
        var iptvs = [];
        data.forEach(item => {
          //var iptv = this.mapToIPTVs(item);
          iptvs.push(<IPTV>iptv);
        });

        return iptvs;
      }));
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "iptv/" + id;
    return this.http.delete<any>(environment.apiUrl + action)
      .pipe(map(data => {
        return data;
      }));
  }

  deleteAll(ids: string) {
    console.log("delete: " + ids);

    var action = "iptv?ids=" + ids;
    return this.http.delete<any>(environment.apiUrl + action)
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
