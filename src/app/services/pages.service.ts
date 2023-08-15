import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from "../models/Users";
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { Page } from '../models/Page';
import { PageContent } from '../models/PageContent';
import { PageComponent } from '../models/PageComponent';




import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';
import { parseJSON } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class PagesService {

  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }

  mapToPages(data: any) {

    let cat: Page; //new Pages();
    cat.id = data.id;
    cat.title = data.title;
    cat.slug = data.slug;
    cat.SelectedTemplate = data.SelectedTemplate;
    cat.isPublish = data.isPublish;
    cat.currentVersion = data.currentVersion;

    cat.IsActive = data.IsActive;
    cat.LastEditBy = data.LastEditBy;
    cat.LastEditDate = data.LastEditDate;

    return cat;
  }

  add(page: Page) {
        var action = "pages"
        if(page.id <= 0){
          //add
          return this.http.post<any>(environment.apiUrl + action, page)
          .pipe(map(data => {
            return data;
          }));
        }else{
          //update
          return this.http.put<any>(environment.apiUrl + action, page)
          .pipe(map(data => {
            return data;
          }));
        }
  }


  createPageContent(pageContent: PageContent) {
    var action = "page_contents"
      return this.http.post<any>(environment.apiUrl + action, pageContent)
      .pipe(map(data => {
        return data;
      }));
  }


  // {
  //   "id": 0,
  //   "createDate": "2023-05-30T11:47:27.730Z",
  //   "lastEditDate": "2023-05-30T11:47:27.730Z",
  //   "createdBy": 0,
  //   "lastEditBy": 0,
  //   "isActive": true,
  //   "pageId": 0,
  //   "html": "string",
  //   "css": "string",
  //   "pageData": "string",
  //   "customCSS": "string",
  //   "customJS": "string",
  //   "cdnLinks": "string",
  //   "isPublish": true,
  //   "version": "string"
  // }



  
  createNewVersion(id: number,version:string){
    return this.http.put<any>(`${environment.apiUrl}pages/create_version/${id}/${version}`, {})
      .pipe(
        map(data => {
          return data;
        }),
      );
  }



  
  pageContentById(id: number): Observable<PageContent> {
    return this.http.get<any>(`${environment.apiUrl}page_contents/get_by_page/${id}`)
      .pipe(
        map(data => {
          return data;
        }),
      );
  }

  getPageComponents(limit): Observable<PageComponent> {
    return this.http.get<any>(`${environment.apiUrl}components?limit=${limit}`)
      .pipe(
        map(data => {
          return data.data;
        }),
      );
  }
  
  

  loadByID(id: number): Observable<Page> {
    //console.log('loadByID' + id);
    return this.http.get<any>(`${environment.apiUrl}pages/${id}`)
      .pipe(
        map(data => {
      //    console.log('loadData successful' + data);

        //  console.log(<Page>data);
          return data;
        }),
      );
  }

  loadData(): Observable<Page[]> {

    return this.http.get<any>(`${environment.apiUrl}pages`)
      .pipe(
        map(data => {
          const pageData = data.data;
          var page: Array<Page> = [];

          if(pageData.length > 0){
            pageData.forEach(item => {
              page.push(<Page>item);
            });
          }
          //console.log(page);
          return page;
        }),
      );
  }

  search(key: string): Observable<Page[]> {
    return this.http.get<any>(`${environment.apiUrl}page/search/${key}`)
      .pipe(
        map(data => {
         // console.log('loadData successful' + data);

          var page = [];
          data.forEach(item => {
            var cat = this.mapToPages(item);
            page.push(item);
          });

         // console.log(page);
          return page;
        }),
      );
  }

  editactive(page: Page) {
    // console.log("editactive: ");

    var action = "course/editactive";
    return this.http.post<any>(environment.apiUrl + action, page)
      .pipe(map(data => {
        var categories = [];
        data.forEach(item => {
          var page = this.mapToPages(item);
          categories.push(page);
        });

        return categories;
      }));
  }


  changePageVersion(version,pageId) {
    var action = `pages/change_version/${pageId}/${version}`;
    return this.http.put<any>(environment.apiUrl + action, {})
      .pipe(map(data => {
          console.log("data",data);
      }));
  }

  
  publishPageVersion(version,pageId) {
    var action = `pages/publish/${pageId}/${version}`;
    return this.http.get<any>(environment.apiUrl + action, {})
      .pipe(map(data => {
          console.log("data",data);
      }));
  }


  
  unpublishPageVersion(pageId) {
    var action = `pages/unpublish/${pageId}`;
    return this.http.get<any>(environment.apiUrl + action, {})
      .pipe(map(data => {
          console.log("data",data);
      }));
  }





  savePage(page: Page) {
    var action = "page/save";
    localStorage.setItem("pageResult",JSON.stringify(page));
    return this.http.post<any>(environment.apiUrl + action, page)
      .pipe(map(data => {
        var resp = [];
        return resp;
      }));
  }

  savePageContent(pageContent: PageContent) {
    var action = "page_contents";
    return this.http.put<any>(environment.apiUrl + action, pageContent)
      .pipe(map(res => {
        return res;
      }));
  }



  saveCustomComponent(component: PageComponent) {
    var action = "components";
    return this.http.post<any>(environment.apiUrl + action, component)
      .pipe(map(data => {
        return data;
      }));
  }

  
  updateCustomComponent(component: PageComponent) {
    var action = "components";
    return this.http.put<any>(environment.apiUrl + action, component)
      .pipe(map(data => {
        var resp = [];
          console.log("resp..............",resp);
        return resp;
      }));
  }



  

  publishPage(page: Page) {
   // console.log("savePage: ");
   // console.log("page",page);
    var action = "page/publish";
    return this.http.post<any>(environment.apiUrl + action, page)
      .pipe(map(data => {
        var resp = [];
        
     //     console.log("resp",resp);
        return resp;
      }));
  }


  delete(id: number) {
   // console.log("delete: " + id);
    var action = "pages/" + id;
    return this.http.delete<any>(environment.apiUrl + action)
      .pipe(map(data => {
        return data;
      }));
  }

  handleError(operation: String) {
    return (err: any) => {
      let errMsg = `error in ${operation}() retrieving ${environment.apiUrl}`;
     // console.log(`${errMsg}:`, err)
      if (err instanceof HttpErrorResponse) {
        // you could extract more info about the error if you want, e.g.:
       // console.log(`status: ${err.status}, ${err.statusText}`);

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
