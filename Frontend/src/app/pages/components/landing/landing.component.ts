import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { TopbarWidgetComponent } from './components/topbar-widget/topbar-widget.component';
import { HeroWidgetComponent } from './components/hero-widget/hero-widget.component';
import { FeaturesWidgetComponent } from './components/features-widget/features-widget.component';
import { FooterWidgetComponent } from './components/footer-widget/footer-widget.component';
@Component({
  selector: 'app-landing',
  imports: [
    CommonModule,
    ButtonGroupModule,
    ButtonModule,
    RouterModule,
    TopbarWidgetComponent,
    HeroWidgetComponent,
    FeaturesWidgetComponent,
    FooterWidgetComponent
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  

}
