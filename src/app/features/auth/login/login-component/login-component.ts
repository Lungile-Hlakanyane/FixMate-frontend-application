import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginRequest } from '../../../../core/models/LoginRequest.model';
import { AuthService } from '../../../../core/services/auth-service/auth-service';
import { UserResponse } from '../../../../core/models/UserResponse.model';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [FormsModule, CommonModule],
  styleUrl: './login-component.scss',
  templateUrl: './login-component.html',
})
export class LoginComponent {

  bannerUser:any = null;

  constructor(private router: Router,private authService: AuthService) {}

  showPassword = false;
  isLoading = false;
  rememberMe = false;

  form = {
    email: '',
    password: ''
  };

  get canSubmit() {
    return this.form.email.trim().length > 3 && this.form.password.length > 0 && !this.isLoading;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

onLogin() {
  if (!this.canSubmit) return;
  this.isLoading = true;

  this.authService.login(this.form.email.trim(), this.form.password).subscribe({
    next: (user: UserResponse) => {
      this.isLoading = false;

      // FIX: active is boolean in your model, status is optional string
      const status = (user.status || '').toString().toUpperCase().trim();
      const isBanned = status === 'BANNED' || user.active === false;

      if (isBanned) {
        // IMPORTANT: Do NOT save session
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        sessionStorage.clear();

        this.router.navigate(['/banner-user'], {
          state: {
            bannedUser: {
              full_name: user.fullName, // your interface uses fullName
              fullName: user.fullName,
              email: user.email,
              id: user.id,
              created_at: user.createdAt,
              status: user.status || 'BANNED'
            }
          }
        });
        return;
      }

      // Normal login only if not banned
      this.authService.saveSession(user);

      switch (user.role) {
        case 'CUSTOMER':
          this.router.navigate(['/home']);
          break;
        case 'PRO':
          this.router.navigate(['/pro-dashboard']);
          break;
        case 'ADMIN':
          this.router.navigate(['/admin-dashboard']);
          break;
        default:
          this.router.navigate(['/home']);
      }
    },
    error: (err) => {
      this.isLoading = false;
      if (err.status === 403 || err.error?.status?.toString().toUpperCase() === 'BANNED') {
        this.router.navigate(['/banned'], {
          state: {
            bannedUser: {
              email: this.form.email.trim(),
              status: 'BANNED'
            }
          }
        });
        return;
      }
      alert(err.error?.message || 'Invalid email or password');
      console.error(err);
    }
  });
}

  loginWithGoogle() {
    alert('Google SSO - integrate with AngularFire / OAuth');
  }

  navigate(link: string) {
    this.router.navigateByUrl(link);
  }

}
