import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { SocialMedia } from '../models/SocialMedia';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SocialMediaService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  add(socialMedia: SocialMedia) {
    var action = 'socialMedia';
    return this.http.post<any>(environment.apiUrl + action, socialMedia)
      .pipe(map(data => {
        return data;
      }));
  }


  update(socialMedia: SocialMedia) {
    var action = 'socialMedia';
    return this.http.put<any>(environment.apiUrl + action, socialMedia)
      .pipe(map(data => {

        console.log("data ......................+++", data)
        return data;
      }));
  }


  loadByID(id: number): Observable<SocialMedia> {
    return this.http.get<any>(`${environment.apiUrl}socialMedia/${id}`)
      .pipe(
        map(data => {
          return <SocialMedia>data;
        }),
      );
  }

  loadData(index: number = 1, limit: number = 10): Observable<SocialMedia[]> {

    return this.http.get<any>(`${environment.apiUrl}socialMedia?index=${index}&limit=${limit}`)
      .pipe(
        map(data => {
          var socialMedia: Array<SocialMedia> = [];
          data.data.forEach(item => {
            socialMedia.push(<SocialMedia>item);
          });

          return socialMedia;
        }),
      );
  }

  search(key: string): Observable<SocialMedia[]> {
    return this.http.get<any>(`${environment.apiUrl}socialMedia/search/${key}`)
      .pipe(
        map(data => {
          var socialMedia = [];
          data.forEach(item => {
            //var cat = this.mapToSocialMedias(item);
            socialMedia.push(<SocialMedia>item);
          });

          console.log(socialMedia);
          return socialMedia;
        }),
      );
  }

  editactive(socialMedia: SocialMedia) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.apiUrl + action, socialMedia)
      .pipe(map(data => {
        var socialMedias = [];
        data.forEach(item => {
          //var socialMedia = this.mapToSocialMedias(item);
          socialMedias.push(<SocialMedia>socialMedia);
        });

        return socialMedias;
      }));
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "socialMedia/" + id;
    return this.http.delete<any>(environment.apiUrl + action)
      .pipe(map(data => {
        return data;
      }));
  }

  deleteAll(ids: string) {
    console.log("delete: " + ids);

    var action = "socialMedia?ids=" + ids;
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
