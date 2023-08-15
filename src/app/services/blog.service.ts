import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from "../models/Users";
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators';
import { Blog } from '../models/Blog';
import { AuthService } from './auth-service.service';
import { JsonPipe } from '@angular/common';
import Swal from "sweetalert2";
import { Comments } from 'src/app/models/Comments';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  
  constructor(private http: HttpClient, private authenticationService: AuthService
  ) { }
  
  add(blog: Blog) {
    
    return this.http.post<any>(environment.apiUrl + "blogs", blog)
      .pipe(map(data => {
        return data;
      }));
  }

  edit(blog: Blog) {
    console.log(blog);
    return this.http.put<any>(environment.apiUrl + "blogs", blog)
      .pipe(map((data: Blog) => {
        return data;
      }));
  }
  changeCommentStatus(blogId, status, commentId) {
    console.log(blogId, status,commentId)
    const route = "blogs/" + blogId + "/comments/" + commentId + '/approval/' + status;
    return this.http.get<any>(environment.apiUrl + route)
      .pipe(map(data => {
        return data;
      }));

  }

  loadByID(id: number): Observable<Blog> {
    console.log('loadByID' + id);
    return this.http.get<any>(`${environment.apiUrl}blogs/${id}`)
      .pipe(
        map(data => {
          return <Blog>data;
        }),
      );
  }

  loadData(): Observable<Blog[]> {

    return this.http.get<any>(`${environment.apiUrl}blogs`)
      .pipe(
        map(data => {
          
          const blogsData = data.data;
          var blog: Array<Blog> = [];
          
          if(blogsData.length > 0){
            blogsData.forEach(item => {
              blog.push(<Blog>item);
            });
          }
      
          return blog;
        }),
      );
  }

  loadTree(id): Observable<Comments[]> {

    return this.http.get<any>(`${environment.apiUrl}blogs/`+id)
      .pipe(
        map(data => {
          const commentData = data.comments;
          var comment: Array<Comments> = [];

          if(commentData.length > 0){
            commentData.forEach(item => {
              comment.push(<Comments>item);
            });
          }        

          return comment;
        }),
      );
  }

  search(key: string): Observable<Blog[]> {
    return this.http.get<any>(`${environment.apiUrl}blog/search/${key}`)
      .pipe(
        map(data => {
          console.log('loadData successful' + data);

          var blog = [];
          data.forEach(item => {
            //var cat = this.mapToBlogs(item);
            blog.push(<Blog>item);
          });

          console.log(blog);
          return blog;
        }),
      );
  }

  publish(blog: Blog) {
    return this.http.put<any>(environment.apiUrl + "blogs", blog)
    .pipe(map((data) => {
      return data;
    
    }));
  }

  delete(id) {
    console.log("delete: " + id);

    var action = "blogs/" + id;
    return this.http.delete<any>(environment.apiUrl + action)
      .pipe(map(data => {
      
        Swal.fire(
          'Deleted!',
          'Your blog has been deleted.',
          'success'
        )
        
        return data;
      }));
  }

  deleteAll(ids) {
    console.log("delete: " + ids);

    // var action = "blogs/" + ids;
    return this.http.request<any>('delete',environment.apiUrl + "blogs", {body:ids})
      .pipe(map(data => {
       
        Swal.fire(
          'Deleted!',
          'Your blog has been deleted.',
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
