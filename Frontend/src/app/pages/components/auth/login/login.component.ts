import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';
import { FloatingconfiguratorComponent } from '../../../../layout/components/floatingconfigurator/floatingconfigurator.component';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule,FloatingconfiguratorComponent,ReactiveFormsModule,CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  LoginForm! : FormGroup;
  isLoading : boolean = false;

  constructor(
    private fb : FormBuilder,
    private messageService : MessageService,
    private authService: AuthService,
    private router : Router
  ){

    this.LoginForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
   
    });
  }





  onSubmit() {
    this.LoginForm.markAllAsTouched(); // Show validation errors

    if (this.LoginForm.invalid) {
      return;
    }
  
    const { username, password} = this.LoginForm.value;
  

    this.isLoading = true;
    this.authService.login({ username, password }).subscribe({
      next: (res:any) => {
        this.isLoading = false;
        console.log(res);
        if(res.statusCode == 1){
          this.messageService.add({
            severity: 'success',
            summary: 'Login Successfully',
            detail: '',
            life: 3000
          });
          this.authService.setToken(res.token);
          localStorage.setItem('IsAuthicated','true');
          this.router.navigate(['/product-management']);
        }
        else{
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: res.message,
            detail: '',
            life: 3000
          });
        }
  

      },
      error: (err) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Signin Failed',
          detail: 'Please try again.',
          life: 3000
        });
      }
    });
    
  }

}
