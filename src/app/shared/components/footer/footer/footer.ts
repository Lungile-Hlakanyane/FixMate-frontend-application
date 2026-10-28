import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

type UserRole = 'customer' | 'pro' | null;

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './footer.scss',
  templateUrl: './footer.html',
})
export class Footer implements OnInit{

  isAuthPage:boolean = false;

  userRole: UserRole | null = null;
  userEmail:string |null = null;

  private authRoutes = ['/login','register','forgot-password','verify', '/otp'];
  
  ngOnInit(): void {

    //load user details role and email
    this.loadUser();

    this.checkRoute(this.router.url);

    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
    .subscribe((e: any) => this.checkRoute(e.urlAfterRedirects));
  }

  currentYear = new Date().getFullYear();

  constructor(private router: Router){}

  navigate(link:string){
    this.router.navigateByUrl(link);
  }

  checkRoute(url:string){
    this.isAuthPage = this.authRoutes.some(r =>{
      url.includes(r)
    })
  }

  loadUser(){
    const role = localStorage.getItem('user role') as UserRole;
    this.userRole = role;
    this.userEmail = localStorage.getItem('user email');
  }

  
  get isCustomer() {
    return this.userRole === 'customer' || this.userRole === null; // default to customer
  }

  get isPro() {
    return this.userRole === 'pro';
  }
  
}
