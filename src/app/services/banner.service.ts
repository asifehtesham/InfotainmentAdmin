import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from "../models/Users";
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { Banner } from '../models/Banner';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  add(banner: Banner) {
    console.log("addBanners: ");
    console.log(banner);

    //var action = (banner.ID <= 0) ? "banner/add" : "banner/edit"
    return this.http.post<any>(environment.apiUrl + "banner", banner)
      .pipe(map((data: Banner) => {
        return data;
      }));
  }

  edit(banner: Banner) {
    console.log("addBanners: ");
    console.log(banner);

    //var action = (banner.ID <= 0) ? "banner/add" : "banner/edit"
    return this.http.put<any>(environment.apiUrl + "banner", banner)
      .pipe(map((data: Banner) => {
        return data;
      }));
  }

  loadByID(id: number): Observable<Banner> {
    console.log('loadByID' + id);
    return this.http.get<any>(`${environment.apiUrl}banner/${id}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);

          console.log(<Banner>data);
          return <Banner>data;
        }),
      );
  }

  loadData(index: number = 1, limit: number = 10): Observable<Banner[]> {

    return this.http.get<any>(`${environment.apiUrl}banner?index=${index}&limit=${limit}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);
          console.log(data.data);
          var banner: Array<Banner> = [];
          data.data.forEach(item => {
            banner.push(<Banner>item);
          });

          console.log(banner);
          return banner;
        }),
      );
  }

  search(key: string): Observable<Banner[]> {
    return this.http.get<any>(`${environment.apiUrl}banner/search/${key}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);

          var banner = [];
          data.forEach(item => {
            //var cat = this.mapToBanners(item);
            banner.push(<Banner>item);
          });

          console.log(banner);
          return banner;
        }),
      );
  }

  change_Visible(banner: Banner) {

    return this.http.put<any>(environment.apiUrl + "banner", banner)
      .pipe(map(data => {
        // var banners = [];
        // data.forEach(item => {
        //   //var banner = this.mapToBanners(item);
        //   banners.push(<Banner>banner);
        // });

        return data;
      }));
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "banner/" + id;
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
