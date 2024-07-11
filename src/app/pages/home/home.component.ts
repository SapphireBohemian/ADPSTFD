//home.component.ts
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';
import { PostServiceService } from '../../services/post-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  id = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[A-Za-z0-9_()\[\]]*$/),
    Validators.minLength(3),
  ]);
  name = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[A-Za-z0-9_()\[\]]*$/),
    Validators.minLength(3),
  ]);
  departmentCode = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[A-Za-z0-9_()\[\]]*$/),
    Validators.minLength(3),
  ]);
  hasError = false;
  errorMessage = '';
  posts: any[] = [];

  constructor(
    private postService: PostServiceService,
    private router: Router,
    private auth: AuthServiceService
  ) {}


  
  ngOnInit(): void {
    if (!this.auth.isLoggedIn) {
      this.router.navigate(['/home']);
      return;
    }

     // Subscribe to the getPost_Service() method to fetch posts
     this.postService.getPost_Service().subscribe({
      next: (data: any) => {
        console.log(data); // Check the fetched data
        this.posts = data.posts; // Assuming posts array is directly in 'data'
      },
      error: (error) => {
        console.error('Error fetching posts:', error);
        // Handle error appropriately
      }
    });
    
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  }

  onDeletePost(id: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost_Service(id).subscribe({
        next: (v) => {
          console.log(v);
  
          const filtered = this.posts.filter((post) => post._id !== id);
          this.posts = filtered;
          console.log('Post deleted:', id);
        },
        error: (e) => console.log(e),
      });
    }
  }
  
}