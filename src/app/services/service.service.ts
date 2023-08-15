import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from "../models/Users";
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { Service } from '../models/Service';
import { ServiceLinks } from '../models/ServiceLinks';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }
 
  add(service: Service) {
    
    return this.http.post<any>(environment.apiUrl + "services", service)
      .pipe(map(data => {
        return data;
      }));
  }

  edit(service: Service) {
    console.log(service);
    return this.http.put<any>(environment.apiUrl + "services", service)
      .pipe(map((data: Service) => {
        return data;
      }));
  }

  editactive(service: Service) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.apiUrl + action, service)
      .pipe(map(data => {
        var services = [];
        data.forEach(item => {
          services.push(<Service>service);
        });

        return services;
      }));
  }

  addLink(serviceLinks: ServiceLinks) {
    console.log(serviceLinks);
    return this.http.post<any>(`${environment.apiUrl}services/links`, serviceLinks)
    .pipe(map((data: ServiceLinks) => {
      return data;
    }));
  }
  updateLink(serviceLinks: ServiceLinks){
    console.log(serviceLinks);
    return this.http.put<any>(environment.apiUrl + "services/links", serviceLinks)
    .pipe(map((data: ServiceLinks) => {
      return data;
    }));
  }
  movedLink(sortLink){
    console.log(sortLink);
    return this.http.put<any>(environment.apiUrl + "services/links/list", sortLink)
    .pipe(map((data) => {
      return data;
    }));
  }

  loadByID(id: number): Observable<Service> {
    return this.http.get<any>(`${environment.apiUrl}services/${id}`)
      .pipe(
        map(data => {
          return <Service>data;
        }),
      );
  }
  loadLinks(id: number): Observable<ServiceLinks> {
    return this.http.get<any>(`${environment.apiUrl}services/${id}/links`)
      .pipe(
        map(data => {
          return <ServiceLinks>data.data;
        }),
      );
  }
  loadData(): Observable<Service[]> {
 
    return this.http.get<any>(`${environment.apiUrl}services`)
      .pipe(
        map(data => {
          console.log(data)
          var service: Array<Service> = [];
          data.data.forEach(item => {
            service.push(<Service>item);
          });
          return service;
        }),
      );
  }

  search(key: string): Observable<Service[]> {
    return this.http.get<any>(`${environment.apiUrl}service/search/${key}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);

          var service = [];
          data.forEach(item => {
            service.push(<Service>item);
          });

          console.log(service);
          return service;
        }),
      );
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "services/" + id;
    return this.http.delete<any>(environment.apiUrl + action)
      .pipe(map(data => {
        Swal.fire(
          'Deleted!',
          'Your Service has been deleted.',
          'success'
        )
        return data;
      }));
  }
  deleteLink(serviceLinks: ServiceLinks) {
    console.log("delete: " + serviceLinks);

    var action = "services/" + serviceLinks.serviceId + "/links/" + serviceLinks.id;
    return this.http.delete<any>(environment.apiUrl + action)
      .pipe(map(data => {
        Swal.fire(
          'Deleted!',
          'Your Link has been deleted.',
          'success'
        )
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
