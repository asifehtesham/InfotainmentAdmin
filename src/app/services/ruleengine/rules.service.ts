import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { Rule } from '../../models/ruleengine/Rule';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RuleService {


  constructor(private http: HttpClient,
    //private authenticationService: AuthService
  ) { }

  add(rule: Rule) {
    var action = 'rule';
    return this.http.post<any>(environment.workflowApiUrl + action, rule)
      .pipe(map(data => {
        return data;
      }));
  }


  update(rule: Rule) {
    var action = 'rule';
    return this.http.put<any>(environment.workflowApiUrl + action, rule)
      .pipe(map(data => {

        console.log("data ......................+++", data)
        return data;
      }));
  }


  loadByID(id: number): Observable<Rule> {
    return this.http.get<any>(`${environment.workflowApiUrl}rule/${id}`)
      .pipe(
        map(data => {
          return <Rule>data;
        }),
      );
  }

  loadData(index: number = 1, limit: number = 10): Observable<Rule[]> {

    return this.http.get<any>(`${environment.workflowApiUrl}rule?index=${index}&limit=${limit}`)
      .pipe(
        map(data => {
          var rule: Array<Rule> = [];
          data.data.forEach(item => {
            rule.push(<Rule>item);
          });

          return rule;
        }),
      );
  }

  search(key: string): Observable<Rule[]> {
    return this.http.get<any>(`${environment.workflowApiUrl}rule/search/${key}`)
      .pipe(
        map(data => {
          var rule = [];
          data.forEach(item => {
            //var cat = this.mapToRules(item);
            rule.push(<Rule>item);
          });

          console.log(rule);
          return rule;
        }),
      );
  }

  editactive(rule: Rule) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.workflowApiUrl + action, rule)
      .pipe(map(data => {
        var rules = [];
        data.forEach(item => {
          //var rule = this.mapToRules(item);
          rules.push(<Rule>rule);
        });

        return rules;
      }));
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "rule/" + id;
    return this.http.delete<any>(environment.workflowApiUrl + action)
      .pipe(map(data => {
        return data;
      }));
  }

  deleteAll(ids: string) {
    console.log("delete: " + ids);

    var action = "rule?ids=" + ids;
    return this.http.delete<any>(environment.workflowApiUrl + action)
      .pipe(map(data => {
        return data;
      }));
  }
  /*
  handleError(operation: String) {
    return (err: any) => {
      let errMsg = `error in ${operation}() retrieving ${environment.workflowApiUrl}`;
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
  }*/
}
