import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-banner-user-componenent',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './banner-user-componenent.scss',
  templateUrl: './banner-user-componenent.html',
})
export class BannerUserComponenent implements OnInit {

  bannedUser:any = null;

  constructor(private router:Router){
    const nav = this.router.getCurrentNavigation();
    this.bannedUser = nav?.extras?.state?.['bannedUser'] || history.state?.bannedUser;
  }

  ngOnInit(): void {
     if (!this.bannedUser) {
      this.bannedUser = { email: 'Your account', fullName: 'Account holder' };
    }
  }

  navigate(link:string){
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigateByUrl(link);
  }
}
