import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from "../models/Users";
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { FormContent } from '../models/FormContent';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FormContentService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  add(formContent: FormContent) {
    console.log("addFormContents: ");
    console.log(formContent);

    //var action = (formContent.ID <= 0) ? "formContent/add" : "formContent/edit"
    return this.http.post<any>(environment.apiUrl + "form_contents", formContent)
      .pipe(map((data: FormContent) => {
        return data;
      }));
  }

  edit(formContent: FormContent) {
    console.log("addFormContents: ");
    console.log(formContent);

    //var action = (formContent.ID <= 0) ? "formContent/add" : "formContent/edit"
    return this.http.put<any>(environment.apiUrl + "form_contents", formContent)
      .pipe(map((data: FormContent) => {
        return data;
      }));
  }

  loadByID(id: number): Observable<FormContent> {
    console.log('loadByID' + id);
    return this.http.get<any>(`${environment.apiUrl}form_contents/${id}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);

          console.log(<FormContent>data);
          return <FormContent>data;
        }),
      );
  }

  get_by_form_version(id: number, version: string): Observable<FormContent> {
    console.log('loadByID' + id);
    return this.http.get<any>(`${environment.apiUrl}form_contents/get_by_form_version/${id}/${version}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);

          console.log(<FormContent>data);
          return <FormContent>data;
        }),
      );
  }
  loadData(index: number = 1, limit: number = 10): Observable<FormContent[]> {

    return this.http.get<any>(`${environment.apiUrl}form_contents?index=${index}&limit=${limit}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);
          console.log(data.data);
          var formContent: Array<FormContent> = [];
          data.data.forEach(item => {
            formContent.push(<FormContent>item);
          });

          console.log(formContent);
          return formContent;
        }),
      );
  }

  search(key: string): Observable<FormContent[]> {
    return this.http.get<any>(`${environment.apiUrl}form_contents/search/${key}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);

          var formContent = [];
          data.forEach(item => {
            //var cat = this.mapToFormContents(item);
            formContent.push(<FormContent>item);
          });

          console.log(formContent);
          return formContent;
        }),
      );
  }

  editactive(formContent: FormContent) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.apiUrl + action, formContent)
      .pipe(map(data => {
        var formContents = [];
        data.forEach(item => {
          //var formContent = this.mapToFormContents(item);
          formContents.push(<FormContent>formContent);
        });

        return formContents;
      }));
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "form_contents/" + id;
    return this.http.delete<any>(environment.apiUrl + action)
      .pipe(map(data => {
        return data;
      }));
  }

}
