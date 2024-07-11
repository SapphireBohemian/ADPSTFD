import { HttpInterceptorFn } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient, HttpInterceptor, HttpHandler, HttpEvent, HttpRequest } from '@angular/common/http';
import { AuthServiceService } from '../services/auth-service.service'; 
import { Observable } from 'rxjs';

//Used to add the auth token to each request going to the backend
@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

  constructor(private authservice : AuthServiceService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler){
    const authToken = this.authservice.getToken();
    const authRequest = request.clone({headers: request.headers.set("x-auth-token", authToken)})
    return next.handle(authRequest)
  }
}