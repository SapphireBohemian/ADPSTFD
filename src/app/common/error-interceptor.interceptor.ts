import { Injectable } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { catchError } from 'rxjs/operators';
import { ErrorComponent } from '../pages/error/error.component';

@Injectable()
export class ErrorInterceptorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (this.suppressCertainErrors(error)) {
          return throwError(error);
        }

        let errorMessage = 'An unknown error occurred.';

        if (error.error && error.error.error) {
          errorMessage = error.error.error;
        }

        this.openErrorDialog(errorMessage);
        throw error;
      })
    );
  }

  openErrorDialog(errorMessage: string) {
    this.dialog.open(ErrorComponent, {
      data: {
        message: errorMessage
      }
    });
  }

  private suppressCertainErrors(error: HttpErrorResponse): boolean {
    const errorObj = JSON.parse(error.error);
          
    if (errorObj.error === 'The username or password is not valid') {
      return true; 
    }
    return false; 
  }
}