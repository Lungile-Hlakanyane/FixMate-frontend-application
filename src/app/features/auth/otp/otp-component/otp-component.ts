import { Component, ElementRef, QueryList, ViewChildren,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp-component',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  styleUrl: './otp-component.scss',
  templateUrl: './otp-component.html',
})
export class OtpComponent {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  otp: string[] = ['', '', '', '', '', ''];
  isLoading = false;
  isResending = false;
  error = '';
  resendTimer = 30;
  private timerInterval: any;

  // Get from your auth service later
  userEmail = 'you@example.com';

  constructor(private router: Router) {
    this.startResendTimer();
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }

  startResendTimer() {
    this.resendTimer = 30;
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.resendTimer > 0) {
        this.resendTimer--;
      } else {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  onInput(index: number, event: any) {
    const value = event.target.value;
    if (!/^\d*$/.test(value)) {
      this.otp[index] = '';
      return;
    }
    this.otp[index] = value.slice(-1);

    if (value && index < 5) {
      this.otpInputs.get(index + 1)?.nativeElement.focus();
    }

    this.error = '';
    if (this.otp.join('').length === 6) {
      this.verifyOtp();
    }
  }

  onKeyDown(index: number, event: KeyboardEvent) {
    if (event.key === 'Backspace' &&!this.otp[index] && index > 0) {
      this.otpInputs.get(index - 1)?.nativeElement.focus();
    }
    if (event.key === 'ArrowLeft' && index > 0) {
      this.otpInputs.get(index - 1)?.nativeElement.focus();
    }
    if (event.key === 'ArrowRight' && index < 5) {
      this.otpInputs.get(index + 1)?.nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const paste = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 6) || '';
    paste.split('').forEach((char, i) => {
      if (i < 6) this.otp[i] = char;
    });
    if (paste.length === 6) {
      this.otpInputs.get(5)?.nativeElement.focus();
      this.verifyOtp();
    }
  }

  verifyOtp() {
    this.router.navigate(['/login']);
  }

  resendCode() {
    if (this.resendTimer > 0) return;
    this.isResending = true;
    setTimeout(() => {
      this.isResending = false;
      this.startResendTimer();
    }, 1000);
  }
}
