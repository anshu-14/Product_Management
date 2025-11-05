import { Routes } from '@angular/router';
import { AccessComponent } from './access/access.component';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { SignUpComponent } from './sign-up/sign-up.component';


export default [
    { path: 'access', component: AccessComponent },
    { path: 'error', component: ErrorComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignUpComponent},

] as Routes;
