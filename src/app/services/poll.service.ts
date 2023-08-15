import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from "../models/Users";
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { Poll } from '../models/Poll';
import { Option } from '../models/Option';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class PollService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }
 
  add(poll: Poll) {
    
    return this.http.post<any>(environment.apiUrl + "poll", poll)
      .pipe(map(data => {
        return data;
      }));
  }

  edit(poll: Poll) {
    console.log(poll);
    return this.http.put<any>(environment.apiUrl + "poll", poll)
      .pipe(map((data: Poll) => {
        return data;
      }));
  }
  addOption(option: Option) {
    console.log(option);
    return this.http.post<any>(environment.apiUrl + "poll/options", option)
    .pipe(map((data: Option) => {
      return data;
    }));
  }
  updateOption(option: Option){
    console.log(option);
    return this.http.put<any>(environment.apiUrl + "poll/options", option)
    .pipe(map((data: Option) => {
      return data;
    }));
  }
  movedOption(sortdOption){
    console.log(sortdOption);
    return this.http.put<any>(environment.apiUrl + "poll/options/list", sortdOption)
    .pipe(map((data) => {
      return data;
    }));
  }

  loadByID(id: number): Observable<Poll> {
    return this.http.get<any>(`${environment.apiUrl}poll/${id}`)
      .pipe(
        map(data => {
          return <Poll>data;
        }),
      );
  }
  loadOptions(id: number): Observable<Option> {
    return this.http.get<any>(`${environment.apiUrl}poll/${id}/options`)
      .pipe(
        map(data => {
          return <Option>data.data;
        }),
      );
  }
  loadData(): Observable<Poll[]> {
 
    return this.http.get<any>(`${environment.apiUrl}poll`)
      .pipe(
        map(data => {
 
          var poll: Array<Poll> = [];
          data.data.forEach(item => {
            poll.push(<Poll>item);
          });
          return poll;
        }),
      );
  }

  search(key: string): Observable<Poll[]> {
    return this.http.get<any>(`${environment.apiUrl}poll/search/${key}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);

          var poll = [];
          data.forEach(item => {
            //var cat = this.mapToPolls(item);
            poll.push(<Poll>item);
          });

          console.log(poll);
          return poll;
        }),
      );
  }

  editactive(poll: Poll) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.apiUrl + action, poll)
      .pipe(map(data => {
        var polls = [];
        data.forEach(item => {
          //var poll = this.mapToPolls(item);
          polls.push(<Poll>poll);
        });

        return polls;
      }));
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "poll/" + id;
    return this.http.delete<any>(environment.apiUrl + action)
      .pipe(map(data => {
        Swal.fire(
          'Deleted!',
          'Your Poll has been deleted.',
          'success'
        )
        return data;
      }));
  }
  deleteOption(option: Option) {
    console.log("delete: " + option.id);

    var action = "poll/" + option.pollId + "/options/" + option.id;
    return this.http.delete<any>(environment.apiUrl + action)
      .pipe(map(data => {
        Swal.fire(
          'Deleted!',
          'Your Option has been deleted.',
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
