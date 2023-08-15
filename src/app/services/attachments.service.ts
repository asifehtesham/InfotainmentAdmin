import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from "../models/Users";
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { Attachment } from '../models/Attachment';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root'
})
export class AttachmentsService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }


  map(data: any) {
    console.log("mapping:");
    console.log(DateTime.fromISO(data.startDate));
    var attachment: Attachment = {
      data: data.data,
      creation: data.creation,
      title: data.title,
      size: data.size,
      url: data.url,
      id: data.id,
      referenceTable: data.referenceTable,
      referenceColumn: data.referenceColumn,
      referenceEntityID: data.referenceEntityID,
    };
    return attachment;
  }
  /*
    add(attachments: Attachments) {
      console.log("addAttachmentss: ");
      console.log(attachments);
  
      //var action = (attachments.ID <= 0) ? "attachments/add" : "attachments/edit"
      return this.http.post<any>(environment.apiUrl + "attachment", attachments)
        .pipe(map((data: Attachments) => {
          return data;
        }));
    }
  
    edit(attachments: Attachments) {
      console.log("addAttachmentss: ");
      console.log(attachments);
  
      //var action = (attachments.ID <= 0) ? "attachments/add" : "attachments/edit"
      return this.http.put<any>(environment.apiUrl + "attachment", attachments)
        .pipe(map((data: Attachments) => {
          return data;
        }));
    }
  
    loadByID(id: number): Observable<Attachment> {
      console.log('loadByID' + id);
      return this.http.get<any>(`${environment.apiUrl}attachment/${id}`)
        .pipe(
          map(data => {
            console.log('loadData successful' + data);
  
            console.log(this.map(data));
            return this.map(data);
          }),
        );
    }
  */
  getByReference(entityId: number, table: string, column: string): Observable<Attachment[]> {

    return this.http.get<any>(`${environment.apiUrl}attachment/get_by_reference/${entityId}/${table}/${column}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);
          console.log(data.data);

          var attachments: Array<Attachment> = data.map(x => this.map(x));

          console.log(attachments);
          return attachments;
        }),
      );
  }
  /*
    loadData(index: number = 1, limit: number = 10): Observable<Attachments[]> {
  
      return this.http.get<any>(`${environment.apiUrl}attachment?index=${index}&limit=${limit}`)
        .pipe(
          map(data => {
            console.log('loadData successful' + data);
            console.log(data.data);
  
            var attachments: Array<Attachments> = data.data.map(x => this.map(x));
            // var attachments: Array<Attachments> = [];
            // data.data.forEach(item => {
            //   attachments.push(<Attachments>item);
            // });
  
            console.log(attachments);
            return attachments;
          }),
        );
    }
  
    search(key: string): Observable<Attachments[]> {
      return this.http.get<any>(`${environment.apiUrl}attachment/search/${key}`)
        .pipe(
          map(data => {
            console.log('loadData successful' + data);
  
            var attachments: Array<Attachments> = data.data.map(x => this.map(x));
            //var attachments = [];
            // data.forEach(item => {
            //   //var cat = this.mapToAttachmentss(item);
            //   attachments.push(<Attachments>item);
            // });
  
            console.log(attachments);
            return attachments;
          }),
        );
    }
  
    editactive(attachments: Attachments) {
      console.log("editactive: ");
  
      var action = "course/editactive";
      return this.http.post<any>(environment.apiUrl + action, attachments)
        .pipe(map(data => {
          var attachmentss = [];
          data.forEach(item => {
            //var attachments = this.mapToAttachmentss(item);
            attachmentss.push(<Attachments>attachments);
          });
  
          return attachmentss;
        }));
    }
  */
  delete(id: number) {
    console.log("delete: " + id);

    var action = "attachment/" + id;
    return this.http.delete<any>(environment.apiUrl + action)
      .pipe(map(data => {
        return data;
      }));
  }

}
