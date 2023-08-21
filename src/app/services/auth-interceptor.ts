import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpInterceptor, HttpHandler, HttpResponse, HttpErrorResponse, HttpEventType } from '@angular/common/http';
//import { AppSettings } from './app-settings';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserService } from './user.service';
import { Router } from '@angular/router';
//import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        //private appSettings: AppSettings
        private userService: UserService,
        private router: Router
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // if (!request.url.startsWith(this.appSettings.coreBaseUrl)) {
        //   return next.handle(request);
        // }
        const token = this.userService.getSocialUser()?.idToken;
        if (token) {
            //TODO: token expiration
            //const expired = AuthService.tokenDeadline < new Date(); //TODO
            const expired = false;
            if (expired) {
                // this.appSettings.interceptresponse.emit({
                //   "type":"token_expired"
                // });
            } else {
                request = request.clone({
                    setHeaders: {
                        'Authorization': 'Bearer ' + token
                    }
                });
            }
        }
        return next.handle(request).pipe(
            catchError(error => {
                if (error.status === 401) {
                    console.log('401 error from backend');
                    this.userService.clear();
                    // Redirect to the login page

                    //this.router.navigate(['/about']);
                }
                return throwError(error);
            })
        )
    }
}