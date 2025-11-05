import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { FloatingconfiguratorComponent } from '../../../../layout/components/floatingconfigurator/floatingconfigurator.component';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { BlockUIModule } from 'primeng/blockui';

@Component({
  selector: 'app-sign-up',
  imports: [
    ButtonModule,BlockUIModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule,FloatingconfiguratorComponent,ReactiveFormsModule,CommonModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  signupForm! : FormGroup;
  isLoading = false;

  constructor(
    private fb : FormBuilder,
    private messageService : MessageService,
    private authService: AuthService,
    private router : Router
  ){

    this.signupForm = this.fb.group({
      userName:[null,[Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }





  onSubmit() {
    this.signupForm.markAllAsTouched(); // Show validation errors
  
    if (this.signupForm.invalid) {
      return;
    }
  
    const { userName,email, password, confirmPassword } = this.signupForm.value;
  
    if (password !== confirmPassword) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Password Mismatch',
        detail: 'Enter matching passwords.',
        life: 3000
      });
      return;
    }

    this.isLoading = true;

    this.authService.signUp({ userName,email, password }).subscribe({
      next: (res:any) => {
        this.isLoading = false;
        if(res.statusCode == 1){
          this.messageService.add({
            severity: 'success',
            summary: '',
            detail: 'User registered successfully.',
            life: 3000
          });
          this.router.navigate(['/auth/login'], { queryParams: { userName } });
        }
        else{
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: res.message,
            detail: '  ',
            life: 3000
          });
        }
  

      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Signup Failed',
          detail: 'Please try again.',
          life: 3000
        });
      }
    });
    
  }
  


}
