import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from "../models/Users";
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { News } from '../models/News';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  add(news: News) {
    var action = 'news';
    return this.http.post<any>(environment.apiUrl + action, news)
      .pipe(map(data => {
        return data;
      }));
  }


  update(news: News) {
    var action = 'news';
    return this.http.put<any>(environment.apiUrl + action, news)
      .pipe(map(data => {

        console.log("data ......................+++", data)
        return data;
      }));
  }


  loadByID(id: number): Observable<News> {
    return this.http.get<any>(`${environment.apiUrl}news/${id}`)
      .pipe(
        map(data => {
          return <News>data;
        }),
      );
  }

  loadData(index: number = 1, limit: number = 10): Observable<News[]> {

    return this.http.get<any>(`${environment.apiUrl}news?index=${index}&limit=${limit}`)
      .pipe(
        map(data => {
          var news: Array<News> = [];
          data.data.forEach(item => {
            news.push(<News>item);
          });

          return news;
        }),
      );
  }

  search(key: string): Observable<News[]> {
    return this.http.get<any>(`${environment.apiUrl}news/search/${key}`)
      .pipe(
        map(data => {
          var news = [];
          data.forEach(item => {
            //var cat = this.mapToNewss(item);
            news.push(<News>item);
          });

          console.log(news);
          return news;
        }),
      );
  }

  editactive(news: News) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.apiUrl + action, news)
      .pipe(map(data => {
        var newss = [];
        data.forEach(item => {
          //var news = this.mapToNewss(item);
          newss.push(<News>news);
        });

        return newss;
      }));
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "news/" + id;
    return this.http.delete<any>(environment.apiUrl + action)
      .pipe(map(data => {
        return data;
      }));
  }

  deleteAll(ids: string) {
    console.log("delete: " + ids);

    var action = "news?ids=" + ids;
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
