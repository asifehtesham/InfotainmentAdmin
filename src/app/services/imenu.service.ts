import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { Imenu } from '../models/Imenu';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ImenuService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  add(imenu: Imenu) {
    var action = 'menu';
    return this.http.post<any>(environment.infotApiUrl + action, imenu)
      .pipe(map(data => {
        return data;
      }));
  }


  update(imenu: Imenu) {
    var action = 'menu';
    return this.http.put<any>(environment.infotApiUrl + action, imenu)
      .pipe(map(data => {

        console.log("data ......................+++", data)
        return data;
      }));
  }


  loadByID(id: number): Observable<Imenu> {
    return this.http.get<any>(`${environment.infotApiUrl}menu/${id}`)
      .pipe(
        map(data => {
          return <Imenu>data;
        }),
      );
  }

  loadData(index: number = 1, limit: number = 10): Observable<Imenu[]> {

    return this.http.get<any>(`${environment.infotApiUrl}menu?index=${index}&limit=${limit}`)
      .pipe(
        map(data => {
          var imenu: Array<Imenu> = [];
          data.data.forEach(item => {
            imenu.push(<Imenu>item);
          });

          return imenu;
        }),
      );
  }

  search(key: string): Observable<Imenu[]> {
    return this.http.get<any>(`${environment.infotApiUrl}menu/search/${key}`)
      .pipe(
        map(data => {
          var imenu = [];
          data.forEach(item => {
            //var cat = this.mapToImenus(item);
            imenu.push(<Imenu>item);
          });

          console.log(imenu);
          return imenu;
        }),
      );
  }

  editactive(imenu: Imenu) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.infotApiUrl + action, imenu)
      .pipe(map(data => {
        var imenus = [];
        data.forEach(item => {
          //var imenu = this.mapToImenus(item);
          imenus.push(<Imenu>imenu);
        });

        return imenus;
      }));
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "menu/" + id;
    return this.http.delete<any>(environment.infotApiUrl + action)
      .pipe(map(data => {
        return data;
      }));
  }

  deleteAll(ids: string) {
    console.log("delete: " + ids);

    var action = "menu?ids=" + ids;
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
