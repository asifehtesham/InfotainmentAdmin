import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { Games } from '../models/Games';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  add(games: Games) {
    var action = 'games';
    return this.http.post<any>(environment.apiUrl + action, games)
      .pipe(map(data => {
        return data;
      }));
  }


  update(games: Games) {
    var action = 'games';
    return this.http.put<any>(environment.apiUrl + action, games)
      .pipe(map(data => {

        console.log("data ......................+++", data)
        return data;
      }));
  }


  loadByID(id: number): Observable<Games> {
    return this.http.get<any>(`${environment.apiUrl}games/${id}`)
      .pipe(
        map(data => {
          return <Games>data;
        }),
      );
  }

  loadData(index: number = 1, limit: number = 10): Observable<Games[]> {

    return this.http.get<any>(`${environment.apiUrl}games?index=${index}&limit=${limit}`)
      .pipe(
        map(data => {
          var games: Array<Games> = [];
          data.data.forEach(item => {
            games.push(<Games>item);
          });

          return games;
        }),
      );
  }

  search(key: string): Observable<Games[]> {
    return this.http.get<any>(`${environment.apiUrl}games/search/${key}`)
      .pipe(
        map(data => {
          var games = [];
          data.forEach(item => {
            //var cat = this.mapToGamess(item);
            games.push(<Games>item);
          });

          console.log(games);
          return games;
        }),
      );
  }

  editactive(games: Games) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.apiUrl + action, games)
      .pipe(map(data => {
        var gamess = [];
        data.forEach(item => {
          //var games = this.mapToGamess(item);
          gamess.push(<Games>games);
        });

        return gamess;
      }));
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "games/" + id;
    return this.http.delete<any>(environment.apiUrl + action)
      .pipe(map(data => {
        return data;
      }));
  }

  deleteAll(ids: string) {
    console.log("delete: " + ids);

    var action = "games?ids=" + ids;
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
