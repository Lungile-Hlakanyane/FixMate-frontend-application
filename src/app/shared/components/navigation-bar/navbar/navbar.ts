import { Component,inject,OnInit,ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, TitleStrategy } from '@angular/router';
import { LayoutService } from '../../../../core/services/layout/layout-service';
import { RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../../core/services/auth-service/auth-service';
import { UserResponse } from '../../../../core/models/UserResponse.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
type UserRole = 'customer' | 'pro' | 'admin' | null;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
  styleUrl: './navbar.scss',
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit{

  profileDataForm!:FormGroup;
  user!:UserResponse;

  isAuthPage = false;
  menuOpen = false;
  profileOpen = false;
  showLogoutModal = false;
  isLoggingOut = false;

  showProfileModal = false;

  userRole: UserRole = null;
  userEmail: string | null = null;

  private authRoutes = ['/login', 'register', 'forgot-password', 'verify', '/otp', 'new-password'];
  private layout = inject(LayoutService);

  constructor(
    private router: Router, 
    private el: ElementRef, 
    private authService:AuthService,
    private fb:FormBuilder
  ){
    this.profileDataForm = this.fb.group({
      fullName: [''],
      location: [''],
      phone: [''],
      occupation: [''],
      available: [],
      biography:['']
    })
  }

  ngOnInit() {
    this.getUserDetails();
    this.loadUser();
    this.checkRoute(this.router.url);
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.checkRoute(e.urlAfterRedirects);
      this.menuOpen = false;
      this.profileOpen = false;
    });
  }

  toggleMenu() {
    this.menuOpen =!this.menuOpen;
    if (this.menuOpen) this.profileOpen = false;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  toggleProfile(event: MouseEvent) {
    event.stopPropagation();
    this.profileOpen =!this.profileOpen;
  }

  onSettings() {
    this.profileOpen = false;
    this.closeMenu();
    this.router.navigate(['/settings']);
  }

// Step 1: Open modal
  onLogout() {
    this.profileOpen = false;
    this.closeMenu();
    this.showLogoutModal = true;
  }

  onProfileModal(){
    this.profileOpen = false;
    this.closeMenu();
    this.showProfileModal = true;
  }

  closeProfileModal(){
    this.showProfileModal = false;
  }

  saveDetails(){
    const userId = Number(localStorage.getItem('user_id'));
    if(!userId){
      console.log('User Id not found');
      return;
    }
    const dto:UserResponse ={
      ...this.user,
      ...this.profileDataForm.value
    }
    console.log('Updating user ID: ', userId, 'with data: ', dto);
    this.authService.updateUserById(userId, dto).subscribe({
      next: (updatedUser:UserResponse)=>{
        console.log('Update success: ', updatedUser);
        this.user = updatedUser;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.closeProfileModal();
      },
      error: (error)=>{
        console.log('Update failed', error);
      }
    })
  }

  // Step 2: User clicked Cancel
  cancelLogout() {
    this.showLogoutModal = false;
    this.isLoggingOut = false;
  }

  // Step 3: User clicked Yes -> spinner -> navigate
  confirmLogout() {
    this.isLoggingOut = true;

    // Replace with your authService.logout() later
    setTimeout(() => {
      localStorage.clear();
      this.isLoggingOut = false;
      this.showLogoutModal = false;
      this.router.navigate(['/login']);
    }, 1200);
  }

  checkRoute(url: string) {
    this.isAuthPage = this.authRoutes.some(r => url.includes(r));
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const profileWrapper = this.el.nativeElement.querySelector('.profile-wrapper');
    if (profileWrapper &&!profileWrapper.contains(target)) {
      this.profileOpen = false;
    }
  }

  // Load role from storage
  loadUser() {
    const rawRole = localStorage.getItem('user_role'); // e.g. "CUSTOMER"
    this.userRole = rawRole ? rawRole.toLowerCase() as UserRole : null;
    this.userEmail = localStorage.getItem('user_email');
  }

  get isCustomer() {
    return this.userRole === 'customer' || this.userRole === null;
  }

  get isPro() {
    return this.userRole === 'pro';
  }

  get isAdmin(){
    return this.userRole === 'admin';
  }

  get roleLabel() {
   if (this.isAdmin) return 'Administrator';
   if (this.isPro) return 'Professional';
   return 'Customer';
  }

  navigate(link:string){
    this.router.navigateByUrl(link);
  }

  getUserDetails(){
    const userId = Number(localStorage.getItem('user_id'));
    console.log('ID FROM localStorage ', userId);
    this.authService.getUserById(userId).subscribe({
      next: (user: UserResponse)=>{
        console.log('User details: ', user);
        this.profileDataForm.patchValue(user);
      },
      error: (err)=>{
        console.log('Error fetching user: ', err);
      }
    })
  }
  
}
