import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth-service/auth-service';
import { Role } from '../../../../core/models/UserRegistrationRequest.model';
import { UserRegistrationRequest } from '../../../../core/models/UserRegistrationRequest.model';

@Component({
  selector: 'app-register-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './register-component.scss',
  templateUrl: './register-component.html',
})
export class RegisterComponent {
  
  showPassword:boolean = false;
  showConfirmPassword:boolean = false;
  isLoading:boolean = false;

  constructor(
    private router:Router,
    private userService:AuthService
  ){}

  form = {
    fullName: '',
    email: '',
    password:'',
    confirmPassword: '',
    role: 'CUSTOMER', //client | professional
    agreeTerms: false,
    phone:'',
    location:'',
    idNumber:'',
  }

  ROLE = {
    CUSTOMER: 'CUSTOMER',
    PRO:'PRO',
    ADMIN:'ADMIN'
  }

  togglePassword() { this.showPassword =!this.showPassword; }
  toggleConfirmPassword() { this.showConfirmPassword =!this.showConfirmPassword; }


onSubmit() {
  if(!this.form.agreeTerms){return;}
  if (this.form.password !== this.form.confirmPassword) {
    alert('Passwords do not match');
    return;
  }
  
  this.isLoading = true;
  const payload: UserRegistrationRequest = {
    fullName: this.form.fullName,
    email: this.form.email,
    password: this.form.password,
    phone: this.form.phone,
    location: this.form.location,
    idNumber: this.form.idNumber || null,
    role: this.form.role as Role
  };

  this.userService.register(payload).subscribe({
    next: (res) => {
      this.isLoading = false;
      this.router.navigate(['/login']);
    },
    error: (err) => {
      this.isLoading = false;
      console.error(err);
      alert(err.error?.message || 'Registration failed');
    }
   });
  }

  navigate(link:string){
    this.router.navigateByUrl(link);
  }

}
