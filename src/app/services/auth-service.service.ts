import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private token!: string;
  private errorMessageSubject = new BehaviorSubject<string>('');
  errorMessage$ = this.errorMessageSubject.asObservable();

  constructor(private http: HttpClient) {}

  isLoggedIn(): boolean {
    if (typeof localStorage !== 'undefined') {
      return !!localStorage.getItem('x-auth-token');
    }
    return false;
  }

  signup(user: any): Observable<string> {
    console.log('auth signup called.');
    return this.http.post('https://localhost:3000/api/users/signup', user, {
      responseType: 'text',
    });
  }

  login(userusername: string, userpassword: string) : Observable<any> {
    return this.http
      .post('https://localhost:3000/api/users/login', {
        username: userusername,
        password: userpassword,
      })
      .pipe(
        tap((response: any) => {
          if (response && response.token) {
            this.token = response.token;
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem('x-auth-token', this.token);
              localStorage.setItem('username', userusername);
            }
          }
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorMessageSubject.next(error.error.message);
          return throwError(error);
        })
      );
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('x-auth-token');
      localStorage.removeItem('username');
    }
  }

  getToken() {
    if (typeof localStorage !== 'undefined') {
      this.token = localStorage.getItem('x-auth-token') || '';
      return this.token;
    }
    return '';
  }

  getUsername() {
    if (typeof localStorage !== 'undefined') {
      const username = localStorage.getItem('username') || '';
      return username;
    }
    return '';
  }
}
