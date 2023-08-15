import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from "../models/Users";
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { Category } from '../models/Category';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  add(category: Category) {
    console.log("addCategories: ");
    console.log(category);
    
      return this.http.post<any>(environment.apiUrl + "categories", category)
      .pipe(map(data => {
        return data;
      }));
  }

  edit(category: Category){
    return this.http.put<any>(environment.apiUrl + "categories", category)
    .pipe(map(data => {
      return data;
    }));
  }

  loadByID(id: number): Observable<Category> {
    console.log('loadByID' + id);
    return this.http.get<any>(`${environment.apiUrl}categories/${id}`)
      .pipe(
        map(data => {
          return <Category>data;
        }),
      );
  }

  loadData(): Observable<Category[]> {

    return this.http.get<any>(`${environment.apiUrl}categories`)
      .pipe(
        map(data => {
          const CategoryData = data.data;
          var category: Array<Category> = [];

          if(CategoryData.length > 0){
            CategoryData.forEach(item => {
              category.push(<Category>item);
            });
          }        

          return category;
        }),
      );
  }

  loadTree(): Observable<Category[]> {

    return this.http.get<any>(`${environment.apiUrl}categories/tree`)
      .pipe(
        map(data => {
          const CategoryData = data.data;
          var category: Array<Category> = [];

          if(CategoryData.length > 0){
            CategoryData.forEach(item => {
              category.push(<Category>item);
            });
          }        

          return category;
        }),
      );
  }

  search(key: string): Observable<Category[]> {
    return this.http.get<any>(`${environment.apiUrl}category/search/${key}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);

          var category = [];
          data.forEach(item => {
          
            category.push(<Category>item);
          });

          console.log(category);
          return category;
        }),
      );
  }

  editactive(category: Category) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.apiUrl + action, category)
      .pipe(map(data => {
        var categories = [];
        data.forEach(item => {
          categories.push(<Category>category);
        });

        return categories;
      }));
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "categories/" + id;
    return this.http.delete<any>(environment.apiUrl + action)
      .pipe(map(data => {
        Swal.fire(
          'Deleted!',
          'Your category has been deleted.',
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
