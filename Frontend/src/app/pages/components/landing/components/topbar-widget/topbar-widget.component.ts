import { Component } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FloatingconfiguratorComponent } from '../../../../../layout/components/floatingconfigurator/floatingconfigurator.component';

@Component({
  selector: 'app-topbar-widget',
  imports: [
    CommonModule,
    ButtonModule,
    RippleModule,
    RouterModule,
    StyleClassModule,
  
  ],
  templateUrl: './topbar-widget.component.html',
  styleUrl: './topbar-widget.component.scss'
})
export class TopbarWidgetComponent {
  constructor(public router: Router) {}
}
