import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from "../models/Users";
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { Form } from '../models/Form';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  add(form: Form) {
    console.log("addForms: ");
    console.log(form);

    //var action = (form.ID <= 0) ? "form/add" : "form/edit"
    return this.http.post<any>(environment.apiUrl + "forms", form)
      .pipe(map((data: Form) => {
        return data;
      }));
  }

  edit(form: Form) {
    console.log("addForms: ");
    console.log(form);

    //var action = (form.ID <= 0) ? "form/add" : "form/edit"
    return this.http.put<any>(environment.apiUrl + "forms", form)
      .pipe(map((data: Form) => {
        return data;
      }));
  }

  loadByID(id: number): Observable<Form> {
    console.log('loadByID' + id);
    return this.http.get<any>(`${environment.apiUrl}forms/${id}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);

          console.log(<Form>data);
          return <Form>data;
        }),
      );
  }

  loadData(index: number = 1, limit: number = 10): Observable<Form[]> {

    return this.http.get<any>(`${environment.apiUrl}forms?index=${index}&limit=${limit}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);
          console.log(data.data);
          var form: Array<Form> = [];
          data.data.forEach(item => {
            form.push(<Form>item);
          });

          console.log(form);
          return form;
        }),
      );
  }

  search(key: string): Observable<Form[]> {
    return this.http.get<any>(`${environment.apiUrl}forms/search/${key}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);

          var form = [];
          data.forEach(item => {
            //var cat = this.mapToForms(item);
            form.push(<Form>item);
          });

          console.log(form);
          return form;
        }),
      );
  }

  editactive(form: Form) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.apiUrl + action, form)
      .pipe(map(data => {
        var forms = [];
        data.forEach(item => {
          //var form = this.mapToForms(item);
          forms.push(<Form>form);
        });

        return forms;
      }));
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "forms/" + id;
    return this.http.delete<any>(environment.apiUrl + action)
      .pipe(map(data => {
        return data;
      }));
  }
  deleteAll(ids: string) {
    console.log("delete: " + ids);

    var action = "forms?ids=" + ids;
    return this.http.delete<any>(environment.apiUrl + action)
      .pipe(map(data => {
        return data;
      }));
  }
  create_version(id: number, new_version: string) {
    return this.http.post<any>(`${environment.apiUrl}forms/create_version/${id}/${new_version}`, {})
      .pipe(map((data: Form) => {
        return data;
      }));
  }

  change_version(id: number, version: string) {
    return this.http.put<any>(`${environment.apiUrl}forms/change_version/${id}/${version}`, {})
      .pipe(map((data: Form) => {
        return data;
      }));
  }
}
