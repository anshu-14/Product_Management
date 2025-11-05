import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../../services/layout.service';
import { StyleClassModule } from 'primeng/styleclass';
import { ConfiguratorComponent } from '../configurator/configurator.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../pages/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  imports: [
    RouterModule,
    CommonModule, 
    StyleClassModule, 
    ConfiguratorComponent
  ],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  items!: MenuItem[];
constructor(private authService:AuthService){

}

  toggleDarkMode() {
      this.layoutService.layoutConfig.update((state: any) => ({ ...state, darkTheme: !state.darkTheme }));
  }

  layoutService = inject(LayoutService);
  auth = inject(AuthService);
  router = inject(Router);

  logout() {
    this.authService.clearToken();
    localStorage.removeItem('IsAuthicated');
    this.router.navigate(['/auth/login']);
  }
}
