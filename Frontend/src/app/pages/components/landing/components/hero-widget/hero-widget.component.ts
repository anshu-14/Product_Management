import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-hero-widget',
  imports: [
    ButtonModule,
    RippleModule,
    RouterModule
  ],
  templateUrl: './hero-widget.component.html',
  styleUrl: './hero-widget.component.scss'
})
export class HeroWidgetComponent {
  constructor(
    private router : Router,
    private authService : AuthService
  ) {
    
  }

  onClick(){
    if(this.authService.isAuthenticated()){
      this.router.navigate(['/certify-iq'])
    }
    else{
      this.router.navigate(['/auth/signup'])
    }
  }
}
