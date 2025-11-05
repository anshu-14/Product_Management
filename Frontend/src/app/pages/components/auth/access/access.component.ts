import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-access',
  imports: [CommonModule,ButtonModule],
  templateUrl: './access.component.html',
  styleUrl: './access.component.scss'
})
export class AccessComponent {
constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
