import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from "../models/Users";
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { Country } from '../models/Country';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CountryService {


constructor(private http: HttpClient, private authenticationService: AuthService
) { }

add(country: Country) {
  var action = 'country';
  return this.http.post<any>(environment.infotApiUrl + action, country)
    .pipe(map(data => {
      return data;
    }));
}


update(country: Country) {
  var action = 'country';
  return this.http.put<any>(environment.infotApiUrl + action, country)
    .pipe(map(data => {

      console.log("data ......................+++", data)
      return data;
    }));
}


loadByID(id: number): Observable < Country > {
  return this.http.get<any>(`${environment.infotApiUrl}country/${id}`)
    .pipe(
      map(data => {
        return <Country>data;
      }),
    );
}

loadData(index: number = 1, limit: number = 10): Observable < Country[] > {

  return this.http.get<any>(`${environment.infotApiUrl}country?index=${index}&limit=${limit}`)
    .pipe(
      map(data => {
        var country: Array<Country> = [];
        data.data.forEach(item => {
          country.push(<Country>item);
        });

        return country;
      }),
    );
}

search(key: string): Observable < Country[] > {
  return this.http.get<any>(`${environment.infotApiUrl}country/search/${key}`)
    .pipe(
      map(data => {
        var country = [];
        data.forEach(item => {
          //var cat = this.mapToCountrys(item);
          country.push(<Country>item);
        });

        console.log(country);
        return country;
      }),
    );
}

editactive(country: Country) {
  console.log("editactive: ");

  var action = "course/editactive";
  return this.http.post<any>(environment.infotApiUrl + action, country)
    .pipe(map(data => {
      var countrys = [];
      data.forEach(item => {
        //var country = this.mapToCountrys(item);
        countrys.push(<Country>country);
      });

      return countrys;
    }));
}

delete (id: number) {
  console.log("delete: " + id);

  var action = "country/" + id;
  return this.http.delete<any>(environment.infotApiUrl + action)
    .pipe(map(data => {
      return data;
    }));
}

deleteAll(ids: string) {
  console.log("delete: " + ids);

  var action = "country?ids=" + ids;
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
