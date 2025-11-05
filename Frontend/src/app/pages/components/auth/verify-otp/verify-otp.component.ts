import { Component,OnDestroy  } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { InputOtpModule } from 'primeng/inputotp';
import { FloatingconfiguratorComponent } from '../../../../layout/components/floatingconfigurator/floatingconfigurator.component';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
@Component({
  selector: 'app-verify-otp',
  imports: [InputOtpModule,FloatingconfiguratorComponent,CommonModule,FormsModule,ReactiveFormsModule,ButtonModule],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.scss'
})
export class VerifyOtpComponent  {

  email: string = '';
  otpForm!: FormGroup;
  timer: number = 300; // 5 minutes in seconds
  intervalId: any;
  formattedTime: string = '';
  isLoading : boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private messageService: MessageService,
    private authService : AuthService,
    private router : Router
  ) {

    this.otpForm = this.fb.group({
      otpCode: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
    // this.startTimer()
  }


  startTimer() {
    this.updateFormattedTime();
    this.intervalId = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
        this.updateFormattedTime();
      } else {
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  updateFormattedTime() {
    const minutes = Math.floor(this.timer / 60);
    const seconds = this.timer % 60;
    this.formattedTime = `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  pad(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  onSubmit() {

    this.otpForm.markAllAsTouched();
    if(this.otpForm.invalid || this.timer <= 0){
      return
    }

    const otp = this.otpForm.value?.otpCode
    const obj = {
      Email : this.email,
      OtpCode : otp
    }
    this.isLoading = true;
    this.authService.vertifyOtp(obj).subscribe({
      next : (res: any) => {
        this.isLoading = false;
        if(res.statusCode == 1){
          this.messageService.add({
            severity: 'success',
            summary: 'OTP Verified!',
            detail : ' You can now login.',
            life: 3000
          });
          
         this.router.navigate(['/auth/login'])
        }  
        else{
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: res.message,
            detail: 'Please try again!',
            life: 3000
          });
        }
      },
      error : (err) =>{
        this.messageService.add({
          severity: 'error',
          summary: 'Signup Failed',
          detail: 'Please try again.',
          life: 3000
        });
      }
    })



 

  }

  // ngOnDestroy() {
  //   clearInterval(this.intervalId); // Prevent memory leaks
  // }

}
