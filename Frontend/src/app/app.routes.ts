import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/components/layout/layout.component';
import { DashboardComponent } from './pages/components/dashboard/dashboard.component';
import { LandingComponent } from './pages/components/landing/landing.component';
import { NotfoundComponent } from './pages/components/notfound/notfound.component';
import { UserExamsComponent } from './pages/components/user-exams/user-exams.component';
import { CoursesComponent } from './pages/components/courses/courses.component';
import { ContactComponent } from './pages/components/contact/contact.component';
import { AboutComponent } from './pages/components/about/about.component';
import { ProfileComponent } from './pages/components/profile/profile.component';
import { LecturesComponent } from './pages/components/lectures/lectures.component';

export const routes: Routes = [
    {   path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    {
        path : 'certify-iq',
        component : LayoutComponent,
        children : [
            {  path : '', component : DashboardComponent },
            {  path : 'user-exams', component : UserExamsComponent },
            {  path : 'courses', component : CoursesComponent },
            {  path : 'lectures', component : LecturesComponent },
            {  path : 'profile', component : ProfileComponent },
            {  path : 'about', component : AboutComponent },
            {  path : 'contact', component : ContactComponent },
            
            
        ]
    },
    {   path : 'landing', component : LandingComponent },
    {   path : 'notfound', component : NotfoundComponent, },
    {   path : 'auth', loadChildren : () => import('./pages/components/auth/auth.routes') },
    {   path: '**', redirectTo: '/notfound'}

];
