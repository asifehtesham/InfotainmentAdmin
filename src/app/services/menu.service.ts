import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { MenuNavbar } from '../models/MenuNavbar';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  add(menu: MenuNavbar) {
    console.log("addMenu: ");
    console.log(menu);
    
      return this.http.post<any>(environment.apiUrl + "menu", menu)
      .pipe(map(data => {
        return data;
      }));
  }

  edit(menu: MenuNavbar){
    return this.http.put<any>(environment.apiUrl + "menu", menu)
    .pipe(map(data => {
      return data;
    }));
  }

  loadByID(id: number): Observable<MenuNavbar> {
    console.log('loadByID' + id);
    return this.http.get<any>(`${environment.apiUrl}menu/${id}`)
      .pipe(
        map(data => {
          return <MenuNavbar>data;
        }),
      );
  }

  loadData(): Observable<MenuNavbar[]> {

    return this.http.get<any>(`${environment.apiUrl}menu`)
      .pipe(
        map(data => {
          const menuData = data.data;
          var menu: Array<MenuNavbar> = [];

          if(menuData.length > 0){
            menuData.forEach(item => {
              menu.push(<MenuNavbar>item);
            });
          }        

          return menu;
        }),
      );
  }

  loadTree(): Observable<MenuNavbar[]> {

    return this.http.get<any>(`${environment.apiUrl}menu/tree`)
      .pipe(
        map(data => {
          const menuData = data.data;
          var menu: Array<MenuNavbar> = [];

          if(menuData.length > 0){
            menuData.forEach(item => {
              menu.push(<MenuNavbar>item);
            });
          }        

          return menu;
        }),
      );
  }

  search(key: string): Observable<MenuNavbar[]> {
    return this.http.get<any>(`${environment.apiUrl}menu/search/${key}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);

          var menu = [];
          data.forEach(item => {
          
            menu.push(<MenuNavbar>item);
          });

          console.log(menu);
          return menu;
        }),
      );
  }

  editactive(menu: MenuNavbar) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.apiUrl + action, menu)
      .pipe(map(data => {
        var menus = [];
        data.forEach(item => {
          menus.push(<MenuNavbar>menu);
        });

        return menus;
      }));
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "menu/" + id;
    return this.http.delete<any>(environment.apiUrl + action)
      .pipe(map(data => {
        Swal.fire(
          'Deleted!',
          'Your menu has been deleted.',
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
