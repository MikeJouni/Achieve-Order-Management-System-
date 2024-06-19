import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { AdminService } from './admin.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(
    private adminService: AdminService,
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    function urlsWithoutTokenReturner() {
      let urlsWithoutToken = [
        '/login',
      ]

      let envUrlLength = environment.baseUrl.length;
      let lastUrlPath = request.url.slice(envUrlLength, request.url.length);

      if (urlsWithoutToken.includes(lastUrlPath)) {
        return true;
      } else {
        return false;
      }

    }


    if (urlsWithoutTokenReturner()) {

      request = request.clone({});

    } else {

      const token = localStorage.getItem('token');

      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: 'Bearer ' + token,
          },
        });
      } else {
        request = request.clone();
      }

    }

    return next.handle(request).pipe(

      catchError((err) => {
        if (err.status === 401) {
          this.adminService.onLogout();
        }
        return throwError(err);
      })

    );


  }
}