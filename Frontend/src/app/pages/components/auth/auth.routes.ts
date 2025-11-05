import { Routes } from '@angular/router';
import { AccessComponent } from './access/access.component';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';

export default [
    { path: 'access', component: AccessComponent },
    { path: 'error', component: ErrorComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignUpComponent},
    { path: 'verify-otp', component: VerifyOtpComponent},
] as Routes;
