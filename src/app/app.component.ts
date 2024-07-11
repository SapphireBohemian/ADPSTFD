import { Component } from '@angular/core';
import { AuthServiceService } from './services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ADPSTFD';

  constructor(private router: Router, private auth: AuthServiceService) {}

  onSignOut() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
