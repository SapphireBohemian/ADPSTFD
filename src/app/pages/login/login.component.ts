import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  private errorMessageSubscription!: Subscription;
  option: string = this.router.url;
  hasError = false;
  errorMessage = '';

  constructor(
    public authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.errorMessageSubscription = this.authService.errorMessage$.subscribe({
      next: (message) => {
        this.errorMessage = message;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.errorMessageSubscription) {
      this.errorMessageSubscription.unsubscribe();
    }
  }

  onLogin(loginForm: NgForm): void {
    this.hasError = false;
    this.errorMessage = '';

    const username = loginForm.value.enteredusername;
    const password = loginForm.value.enteredpassword;

    if (!username || !password) {
      this.hasError = true;
      this.errorMessage = 'Please fill in all inputs';
      return;
    }

    if (this.option == '/login') {
      this.authService.login(username, password).subscribe({
        next: (response) => {
          console.log(response);
          this.router.navigate(['/home']);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = 'Incorrect username or password.';
          this.hasError = true;
        }
      });
    }
  }
}
