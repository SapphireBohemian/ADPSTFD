//post.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';
import { PostServiceService } from '../../services/post-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {
  postForm: FormGroup;
  hasError: boolean = false;
  errorMessage: string = '';
  postSubscription: Subscription | undefined;

  constructor(
    private postService: PostServiceService,
    private router: Router,
    private auth: AuthServiceService,
    private fb: FormBuilder
  ) {
    this.postForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
     //departmentCode: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {}

  onAddPost() {
    if (this.postForm.valid) {
      const { id, name, departmentCode } = this.postForm.value;
      this.postSubscription = this.postService.addPost_Service(id, name, departmentCode).subscribe({
        next: response => {
          console.log('Post added successfully', response);
          this.postForm.reset();
          this.hasError = false;
        },
        error: error => {
          console.error('Error adding post', error);
          this.errorMessage = 'Error adding post. Please try again later.';
          this.hasError = true;
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
  }
}