import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password-component',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  styleUrl: './forgot-password-component.scss',
  templateUrl: './forgot-password-component.html',
})
export class ForgotPasswordComponent {

  constructor(private router:Router){}

  email = '';
  isLoading = false;
  isSent = false;
  error = '';

  onSubmit() {
    if (!this.email) {
      this.error = 'Please enter your email address';
      return;
    }
    this.isLoading = true;
    this.error = '';
    // Replace with your API call later
    setTimeout(() => {
      this.isLoading = false;
      this.isSent = true;
      this.navigate('/new-password');
    }, 1200);
  }

  resetForm() {
    this.isSent = false;
    this.email = '';
  }

  navigate(link:string){
    this.router.navigateByUrl(link);
  }
}
