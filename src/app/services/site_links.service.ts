import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { SiteLinks } from '../models/SiteLinks';
import { AuthService } from './auth-service.service';


@Injectable({
  providedIn: 'root'
})
export class SiteLinksService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  get_links() {
    return this.http.get<any>(`${environment.apiUrl}services/site_links`)
      .pipe(
        map(data => {
          return data;
        }),
      );
  }

}
