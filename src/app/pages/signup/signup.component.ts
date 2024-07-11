import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  fname = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[A-Za-z\s'-]+$/),
    Validators.minLength(3),
  ]);
  sname = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[A-Za-z\s'-]+$/),
    Validators.minLength(3),
  ]);
  username = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[A-Za-z0-9_]{3,20}$/),
    Validators.minLength(3),
  ]);
  email = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    Validators.minLength(3),
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    ),
    Validators.minLength(3),
  ]);
  confirmpassword = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);
  hasError = false;
  errorMessage = '';

  ngOnInit(): void {}

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  onSignup() {
    this.hasError = false;
    this.errorMessage = '';

    const fnameValue = this.fname.value;
    const snameValue = this.sname.value;
    const usernameValue = this.username.value;
    const emailValue = this.email.value;
    const passwordValue = this.password.value;
    const confirmPasswordValue = this.confirmpassword.value;

    if (
      !fnameValue ||
      !snameValue ||
      !usernameValue ||
      !emailValue ||
      !passwordValue ||
      !confirmPasswordValue
    ) {
      this.hasError = true;
      this.errorMessage = 'Please fill in all inputs';
      return;
    }

    if (passwordValue != confirmPasswordValue) {
      this.hasError = true;
      this.errorMessage = 'Passwords must match';
      return;
    }

    const user = {
      fname: fnameValue,
      sname: snameValue,
      username: usernameValue,
      email: emailValue,
      password: passwordValue,
    };

    this.authService.signup(user).subscribe(
      (v) => {
        if (v === 'Created') {
          this.router.navigate(['/login']);
        } else {
          this.hasError = true;
          this.errorMessage = 'Unexpected response: ' + v;
        }
      },
      (err: HttpErrorResponse) => {
        console.log('Error Response:', err);
        this.hasError = true;
        try {
          const errorObj = JSON.parse(err.error);
          this.errorMessage = errorObj.error;
        } catch (e) {
          this.errorMessage = 'An unknown error occurred.';
        }
      }
    );
  }
}
