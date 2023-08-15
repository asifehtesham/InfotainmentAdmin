import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth-service.service';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with basic auth credentials if available

        console.log('Come inside the BasicAuthInterceptor');
        //console.log(this.authenticationService.currentUserValue.auth_token);
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.auth_token) {
            console.log('Settings headers');
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer ${currentUser.auth_token}`
                    //'Content-type': 'application/json'
                }
            });
        }

        console.log('finish BasicAuthInterceptor');
        return next.handle(request);
    }
}