import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { IptvCategory } from '../models/IptvCategory';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class IptvCategoryService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  add(iptvCategory: IptvCategory) {
    var action = 'iptvCategory';
    return this.http.post<any>(environment.apiUrl + action, iptvCategory)
      .pipe(map(data => {
        return data;
      }));
  }


  update(iptvCategory: IptvCategory) {
    var action = 'iptvCategory';
    return this.http.put<any>(environment.apiUrl + action, iptvCategory)
      .pipe(map(data => {

        console.log("data ......................+++", data)
        return data;
      }));
  }


  loadByID(id: number): Observable<IptvCategory> {
    return this.http.get<any>(`${environment.apiUrl}iptvCategory/${id}`)
      .pipe(
        map(data => {
          return <IptvCategory>data;
        }),
      );
  }

  loadData(index: number = 1, limit: number = 10): Observable<IptvCategory[]> {

    return this.http.get<any>(`${environment.apiUrl}iptvCategory?index=${index}&limit=${limit}`)
      .pipe(
        map(data => {

          console.log("data.+.+",data);

          var iptvCategory: Array<IptvCategory> = [];
          data.data.forEach(item => {
            iptvCategory.push(<IptvCategory>item);
          });

          return iptvCategory;
        }),
      );
  }

  search(key: string): Observable<IptvCategory[]> {
    return this.http.get<any>(`${environment.apiUrl}iptvCategory/search/${key}`)
      .pipe(
        map(data => {
          var iptvCategory = [];
          data.forEach(item => {
            //var cat = this.mapToiptvCategorys(item);
            iptvCategory.push(<IptvCategory>item);
          });

          console.log(iptvCategory);
          return iptvCategory;
        }),
      );
  }

  editactive(iptvCategory: IptvCategory) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.apiUrl + action, iptvCategory)
      .pipe(map(data => {
        var iptvCategorys = [];
        data.forEach(item => {
          //var iptvCategory = this.mapToiptvCategorys(item);
          iptvCategorys.push(<IptvCategory>iptvCategory);
        });

        return iptvCategorys;
      }));
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "iptvCategory/" + id;
    return this.http.delete<any>(environment.apiUrl + action)
      .pipe(map(data => {
        return data;
      }));
  }

  deleteAll(ids: string) {
    console.log("delete: " + ids);

    var action = "iptvCategory?ids=" + ids;
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
