import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { SocialMediaType } from '../models/SocialMediaType';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SocialMediaTypeService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  add(socialMediaType: SocialMediaType) {
    var action = 'socialMediaType';
    return this.http.post<any>(environment.apiUrl + action, socialMediaType)
      .pipe(map(data => {
        return data;
      }));
  }


  update(socialMediaType: SocialMediaType) {
    var action = 'socialMediaType';
    return this.http.put<any>(environment.apiUrl + action, socialMediaType)
      .pipe(map(data => {

        console.log("data ......................+++", data)
        return data;
      }));
  }


  loadByID(id: number): Observable<SocialMediaType> {
    return this.http.get<any>(`${environment.apiUrl}socialMediaType/${id}`)
      .pipe(
        map(data => {
          return <SocialMediaType>data;
        }),
      );
  }

  loadData(index: number = 1, limit: number = 10): Observable<SocialMediaType[]> {

    return this.http.get<any>(`${environment.apiUrl}socialMediaType?index=${index}&limit=${limit}`)
      .pipe(
        map(data => {
          var socialMediaType: Array<SocialMediaType> = [];
          data.data.forEach(item => {
            socialMediaType.push(<SocialMediaType>item);
          });

          return socialMediaType;
        }),
      );
  }

  search(key: string): Observable<SocialMediaType[]> {
    return this.http.get<any>(`${environment.apiUrl}socialMediaType/search/${key}`)
      .pipe(
        map(data => {
          var socialMediaType = [];
          data.forEach(item => {
            //var cat = this.mapToSocialMediaTypes(item);
            socialMediaType.push(<SocialMediaType>item);
          });

          console.log(socialMediaType);
          return socialMediaType;
        }),
      );
  }

  editactive(socialMediaType: SocialMediaType) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.apiUrl + action, socialMediaType)
      .pipe(map(data => {
        var socialMediaTypes = [];
        data.forEach(item => {
          //var socialMediaType = this.mapToSocialMediaTypes(item);
          socialMediaTypes.push(<SocialMediaType>socialMediaType);
        });

        return socialMediaTypes;
      }));
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "socialMediaType/" + id;
    return this.http.delete<any>(environment.apiUrl + action)
      .pipe(map(data => {
        return data;
      }));
  }

  deleteAll(ids: string) {
    console.log("delete: " + ids);

    var action = "socialMediaType?ids=" + ids;
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
