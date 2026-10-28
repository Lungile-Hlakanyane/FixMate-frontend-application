import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Route, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-new-password-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './new-password-component.scss',
  templateUrl: './new-password-component.html',
})
export class NewPasswordComponent {

  constructor(private router:Router){}

  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  isSuccess = false;

  form = {
    password: '',
    confirmPassword: ''
  };

  errors = {
    password: '',
    confirmPassword: ''
  };

  get passwordStrength(): number {
    const p = this.form.password;
    let score = 0;
    if (!p) return 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  }

  get strengthLabel(): string {
    const map = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    return map[this.passwordStrength - 1] || '';
  }

  togglePassword() { this.showPassword =!this.showPassword; }
  toggleConfirmPassword() { this.showConfirmPassword =!this.showConfirmPassword; }

  onSubmit() {
    this.errors = { password: '', confirmPassword: '' };
    let valid = true;

    if (this.form.password.length < 8) {
      this.errors.password = 'Password must be at least 8 characters';
      valid = false;
    }
    if (this.form.password!== this.form.confirmPassword) {
      this.errors.confirmPassword = 'Passwords do not match';
      valid = false;
    }
    if (!valid) return;

    this.isLoading = true;
    // Replace with API call later
    setTimeout(() => {
      this.isLoading = false;
      this.isSuccess = true;
      this.navigate('/login');
    }, 1200);
  }

  navigate(link:string){
    this.router.navigateByUrl(link);
  }
}
