import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Footer } from '../../../../shared/components/footer/footer/footer';
import { Navbar } from '../../../../shared/components/navigation-bar/navbar/navbar';
import { AuthService } from '../../../../core/services/auth-service/auth-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { AsyncPipe, DecimalPipe, NgFor, NgIf } from '@angular/common';


@Component({
  selector: 'app-admin-dashboard-component',
  standalone: true,
  imports: [CommonModule, FormsModule, Footer, Navbar, DecimalPipe, AsyncPipe, NgFor, NgIf],
  styleUrl: './admin-dashboard-component.scss',
  templateUrl: './admin-dashboard-component.html',
})
export class AdminDashboardComponent implements OnInit{

  totalUsers$!: Observable<number>;

  constructor(
    private router: Router, 
    private authService:AuthService
  ){}

 stats = [
    { label: 'Total Users', value: '...', sub: '+2 this week', color: 'blue' },
  ];

  recentJobs = [
    { id: 'FM-1024', customer: 'Sarah Jenkins', pro: 'David M.', service: 'Plumbing', amount: 'R450', status: 'pending' },
  ];

   ngOnInit() {
    this.getTotalUsers();
  }

  navigate(link:string){
    this.router.navigateByUrl(link);
  }

  getTotalUsers(){
    this.totalUsers$ = this.authService.getTotalUsers();
  }

}
