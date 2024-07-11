//post-service.serv
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class PostServiceService {
  constructor(private http: HttpClient, private authService: AuthServiceService) {}

  private getHeaders() {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Get posts from the backend
  getPost_Service() {
    const headers = this.getHeaders();
    return this.http.get('https://localhost:3000/api/posts', { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Add a new post
  addPost_Service(id: string, name: string, departmentCode: string) {
    const headers = this.getHeaders();
    return this.http.post('https://localhost:3000/api/posts', {
      id,
      name,
      departmentCode
    }, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a post
  deletePost_Service(postId: string) {
    const headers = this.getHeaders();
    return this.http.delete(`https://localhost:3000/api/posts/${postId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    const errorMessage = error.error ? error.error.message : 'An unknown error occurred';
    console.error('An error occurred:', errorMessage);
    return throwError('Something bad happened; please try again later.');
  }
  
}
