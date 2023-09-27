import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { JsonPipe } from '@angular/common';
import { Workflow } from '../../models/ruleengine/Workflow';
import { Rule } from 'src/app/models/ruleengine/Rule';
import { WorkflowRule } from 'src/app/models/ruleengine/WorkflowRule';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {


  constructor(private http: HttpClient,
    //private authenticationService: AuthService
  ) { }

  add(workflow: Workflow) {
    var action = 'workflow';
    return this.http.post<any>(environment.workflowApiUrl + action, workflow)
      .pipe(map(data => {
        return data;
      }));
  }


  assignRule(workflowRule: WorkflowRule) {
    var action = 'workflow/assign_rule';
    return this.http.post<any>(environment.workflowApiUrl + action, workflowRule)
      .pipe(map(data => {
        return data;
      }));
  }

  update(workflow: Workflow) {
    var action = 'workflow';
    return this.http.put<any>(environment.workflowApiUrl + action, workflow)
      .pipe(map(data => {

        console.log("data ......................+++", data)
        return data;
      }));
  }


  loadByID(id: number): Observable<Workflow> {
    return this.http.get<any>(`${environment.workflowApiUrl}workflow/${id}`)
      .pipe(
        map(data => {
          return <Workflow>data;
        }),
      );
  }

  loadData(index: number = 1, limit: number = 10): Observable<Workflow[]> {

    return this.http.get<any>(`${environment.workflowApiUrl}workflow?index=${index}&limit=${limit}`)
      .pipe(
        map(data => {
          var workflow: Array<Workflow> = [];
          data.data.forEach(item => {
            workflow.push(<Workflow>item);
          });

          return workflow;
        }),
      );
  }

  getRules(id: number): Observable<Rule[]> {

    return this.http.get<any>(`${environment.workflowApiUrl}workflow/${id}/rules`)
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

  search(key: string): Observable<Workflow[]> {
    return this.http.get<any>(`${environment.workflowApiUrl}workflow/search/${key}`)
      .pipe(
        map(data => {
          var workflow = [];
          data.forEach(item => {
            //var cat = this.mapToWorkflows(item);
            workflow.push(<Workflow>item);
          });

          console.log(workflow);
          return workflow;
        }),
      );
  }

  editactive(workflow: Workflow) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.workflowApiUrl + action, workflow)
      .pipe(map(data => {
        var workflows = [];
        data.forEach(item => {
          //var workflow = this.mapToWorkflows(item);
          workflows.push(<Workflow>workflow);
        });

        return workflows;
      }));
  }

  delete(id: number) {
    console.log("delete: " + id);

    var action = "workflow/" + id;
    return this.http.delete<any>(environment.workflowApiUrl + action)
      .pipe(map(data => {
        return data;
      }));
  }


  removeRule(id: number) {
    console.log("delete: ", id);

    var action = "workflow/remove_rule/" + id;
    return this.http.delete<any>(environment.workflowApiUrl + action)
      .pipe(map(data => {
        return data;
      }));
  }

  deleteAll(ids: string) {
    console.log("delete: " + ids);

    var action = "workflow?ids=" + ids;
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
    }
  */
}
