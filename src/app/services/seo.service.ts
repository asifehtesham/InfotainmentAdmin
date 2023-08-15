import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from "../models/Users";
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { SEO } from '../models/SEO';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SEOService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  add(seo: SEO) {
    console.log("addSEOs: ");
    console.log(seo);

    //var action = (seo.ID <= 0) ? "seo/add" : "seo/edit"
    return this.http.post<any>(environment.apiUrl + "seo", seo)
      .pipe(map((data: SEO) => {
        return data;
      }));
  }

  edit(seo: SEO) {
    console.log("addSEOs: ");
    console.log(seo);

    //var action = (seo.ID <= 0) ? "seo/add" : "seo/edit"
    return this.http.put<any>(environment.apiUrl + "seo", seo)
      .pipe(map((data: SEO) => {
        return data;
      }));
  }

  loadByID(id: number): Observable<SEO> {
    console.log('loadByID' + id);
    return this.http.get<any>(`${environment.apiUrl}seo/${id}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);

          console.log(<SEO>data);
          return <SEO>data;
        }),
      );
  }

  loadData(index: number = 1, limit: number = 10): Observable<SEO[]> {

    return this.http.get<any>(`${environment.apiUrl}seo?index=${index}&limit=${limit}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);
          console.log(data);
          var seo: Array<SEO> = [];
          data.forEach(item => {
            seo.push(<SEO>item);
          });

          console.log(seo);
          return seo;
        }),
      );
  }

  search(key: string): Observable<SEO[]> {
    return this.http.get<any>(`${environment.apiUrl}seo/search/${key}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);

          var seo = [];
          data.forEach(item => {
            //var cat = this.mapToSEOs(item);
            seo.push(<SEO>item);
          });

          console.log(seo);
          return seo;
        }),
      );
  }

  change_Visible(seo: SEO) {

    return this.http.put<any>(environment.apiUrl + "seo", seo)
      .pipe(map(data => {
        // var seos = [];
        // data.forEach(item => {
        //   //var seo = this.mapToSEOs(item);
        //   seos.push(<SEO>seo);
        // });

        return data;
      }));
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "seo/" + id;
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
