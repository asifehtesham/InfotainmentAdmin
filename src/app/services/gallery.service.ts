import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from "../models/Users";
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { Gallery } from '../models/Gallery';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  add(gallery: Gallery) {
    console.log("addGallerys: ");
    console.log(gallery);

    var action = "gallery";
    return this.http.post<any>(environment.apiUrl + action, gallery)
      .pipe(map(data => {
        return data;
      }));
  }

  update(gallery: Gallery) {
    var action = 'gallery';
    return this.http.put<any>(environment.apiUrl + action, gallery)
      .pipe(map(data => {

        console.log("data ......................+++", data)
        return data;
      }));
  }


  loadByID(id: number): Observable<Gallery> {
    console.log('loadByID' + id);
    return this.http.get<any>(`${environment.apiUrl}gallery/${id}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);

          console.log(<Gallery>data);
          return <Gallery>data;
        }),
      );
  }

  loadData(index: number = 1, limit: number = 10): Observable<Gallery[]> {

    return this.http.get<any>(`${environment.apiUrl}gallery`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);

          var gallery: Array<Gallery> = [];
          data.data.forEach(item => {
            gallery.push(<Gallery>item);
          });

          console.log(gallery);
          return gallery;
        }),
      );
  }

  search(key: string): Observable<Gallery[]> {
    return this.http.get<any>(`${environment.apiUrl}gallery/search/${key}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);

          var gallery = [];
          data.forEach(item => {
            //var cat = this.mapToGallerys(item);
            gallery.push(<Gallery>item);
          });

          console.log(gallery);
          return gallery;
        }),
      );
  }

  editactive(gallery: Gallery) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.apiUrl + action, gallery)
      .pipe(map(data => {
        var gallerys = [];
        data.forEach(item => {
          //var gallery = this.mapToGallerys(item);
          gallerys.push(<Gallery>gallery);
        });

        return gallerys;
      }));
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "gallery/" + id;
    return this.http.delete<any>(environment.apiUrl + action)
      .pipe(map(data => {
        return data;
      }));
  }

  deleteAll(ids: string) {
    var action = "gallery?ids=" + ids;
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
