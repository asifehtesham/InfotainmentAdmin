import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "../models/Users";
import { environment } from "src/environments/environment";
import { map, catchError } from "rxjs/operators";
import { Page } from "../models/Page";
import { PageContent } from "../models/PageContent";
import { AuthService } from "./auth-service.service";
import { JsonPipe } from "@angular/common";
import { parseJSON } from "date-fns";
import { PageComponent } from "../models/PageComponent";

@Injectable({
  providedIn: "root",
})
export class ComponentService {
  constructor(
    private http: HttpClient,
    private authenticationService: AuthService
  ) {}

  mapToPages(data: any) {
    let cat: Page; //new Pages();
    cat.id = data.id;
    cat.title = data.Title;
    cat.slug = data.slug;
    cat.SelectedTemplate = data.SelectedTemplate;
    cat.isPublish = data.isPublish;
    cat.IsActive = data.IsActive;
    cat.LastEditBy = data.LastEditBy;
    cat.LastEditDate = data.LastEditDate;

    return cat;
  }

  add(page: Page) {
    console.log("addPages: ");
    console.log(page);

    var action = page.id <= 0 ? "page/add" : "page/edit";
    return this.http.post<any>(environment.apiUrl + action, page).pipe(
      map((data) => {
        return data;
      })
    );
  }

  componentById(slug: string): Observable<PageComponent> {

    return this.http.get<any>(`${environment.apiUrl}components/${slug}`).pipe(
      map((data) => {
        return <PageComponent>data;
      })
    );
  }

  loadData(): Observable<PageComponent[]> {
    return this.http.get<any>(`${environment.apiUrl}components`).pipe(
      map((data) => {
        var page: Array<PageComponent> = [];
        const resData = data.data;
        if (resData.length > 0) {
          resData.forEach((item) => {
            page.push(<PageComponent>item);
          });
        }
        return page;
      })
    );
  }

  search(key: string): Observable<PageContent[]> {
    return this.http.get<any>(`${environment.apiUrl}page/search/${key}`).pipe(
      map((data) => {
        console.log("loadData successful" + data);

        var page = [];
        data.forEach((item) => {
          var cat = this.mapToPages(item);
          page.push(item);
        });

        console.log(page);
        return page;
      })
    );
  }

  editactive(page: Page) {
    console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.apiUrl + action, page).pipe(
      map((data) => {
        var categories = [];
        data.forEach((item) => {
          var page = this.mapToPages(item);
          categories.push(page);
        });

        return categories;
      })
    );
  }

  savePage(page: Page) {
    console.log("savePage: ");
    console.log("page", page);
    var action = "page/save";

    localStorage.setItem("pageResult", JSON.stringify(page));

    return this.http.post<any>(environment.apiUrl + action, page).pipe(
      map((data) => {
        var resp = [];

        console.log("resp", resp);
        return resp;
      })
    );
  }

  saveCustomComponent(component: Page) {
    console.log("savePage: ");
    console.log("page", component);
    var action = "page/save/component";

    //localStorage.setItem("pageResult",JSON.stringify(component));

    return this.http.post<any>(environment.apiUrl + action, component).pipe(
      map((data) => {
        var resp = [];
        console.log("resp", resp);
        return resp;
      })
    );
  }

  publishPage(page: Page) {
    console.log("savePage: ");
    console.log("page", page);
    var action = "page/publish";
    return this.http.post<any>(environment.apiUrl + action, page).pipe(
      map((data) => {
        var resp = [];

        console.log("resp", resp);
        return resp;
      })
    );
  }

  delete(id: number) {
    var action = "components/" + id;
    return this.http.delete<any>(environment.apiUrl + action).pipe(
      map((data) => {
        return data;
      })
    );
  }

  handleError(operation: String) {
    return (err: any) => {
      let errMsg = `error in ${operation}() retrieving ${environment.apiUrl}`;
      console.log(`${errMsg}:`, err);
      if (err instanceof HttpErrorResponse) {
        // you could extract more info about the error if you want, e.g.:
        console.log(`status: ${err.status}, ${err.statusText}`);

        var refreshToken = this.authenticationService.getRefreshToken();

        var jwtToken = this.authenticationService.currentUserValue.auth_token;
        var refreshResponse = this.authenticationService
          .refresh(jwtToken)
          .then((x) => {});
        console.log("refreshResponse");
        console.log(refreshResponse);
      }
    };
  }
}
