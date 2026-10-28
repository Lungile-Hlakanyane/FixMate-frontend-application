import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Footer } from '../../../../shared/components/footer/footer/footer';
import { Navbar } from '../../../../shared/components/navigation-bar/navbar/navbar';
import { ServiceRequest } from '../../../../core/models/ServiceRequest.model';
import { ServiceRequestsService } from '../../../../core/services/service-requests-service/service-requests-service';
import { ChangeDetectorRef } from '@angular/core';
import { JobStatus } from '../../../../shared/models/Job.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-earnings-component',
  standalone: true,
  imports: [CommonModule, FormsModule, Footer, Navbar],
  styleUrl: './earnings-component.scss',
  templateUrl: './earnings-component.html',
})
export class EarningsComponent implements OnInit{

  totalEarnings:number = 0;
  totalEarningsThisMonth:number = 0;
  totalCompletedJobs:number = 0;
  awaitingTotal:number=0;
  awaitingJobs:any=0;

  constructor(
    private router:Router,
    private serviceRequest:ServiceRequestsService,
    private cdf:ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.fetchTransactionsForPro();
    this.getTotalProEranings();
    this.getTotalEarningsByProThisMonth();
    this.getCompletedJobsForPro();
    this.getAwaitingTotal();
    this.getListAwaitingPaymentJobs();
  }

  navigate(link:string){this.router.navigateByUrl(link);}

  activePeriod: 'week' | 'month' | 'year' = 'month';

  summary = {
    total: 'R45,320',
    thisMonth: 'R12,840',
    growth: '+12%',
    pending: 'R1,850',
    completedJobs: 124
  };

  weekly = [
    { label: 'Mon', value: 450, height: 40 },
    { label: 'Tue', value: 800, height: 65 },
    { label: 'Wed', value: 300, height: 30 },
    { label: 'Thu', value: 1200, height: 95 },
    { label: 'Fri', value: 650, height: 55 },
    { label: 'Sat', value: 950, height: 75 },
    { label: 'Sun', value: 200, height: 20 },
  ];

  transactions: ServiceRequest[] = [];

  fetchTransactionsForPro(){
    const proId = Number(localStorage.getItem('user_id'));
    if(!proId){
      console.log('Error fetching proId');
      return;
    }
    this.serviceRequest.getPaidServiceByPro(proId, 'PAID').subscribe({
      next:(res: any)=>{
        this.transactions = res;
        console.log('Paid service request for pro here ', this.transactions);
        this.cdf.detectChanges();
      },
      error:(err)=>{
        console.log('Error fetching paid services requests here ',err);
        this.cdf.detectChanges();      
      }
    });
  }

  getTotalProEranings(){
    const proId = Number(localStorage.getItem('user_id'));
    if(!proId){
      console.log('Error fetching proId');
      return;
    }
    this.serviceRequest.getProTotalEarnings(proId).subscribe({
      next: (res:any)=>{
        this.totalEarnings = res;
        console.log('Total earnings: ', this.totalEarnings);
        this.cdf.detectChanges();
      },
      error:(err)=>{
        console.log('Error fecthing pro earnings');
        this.cdf.detectChanges();
      }
    })
  }

  getTotalEarningsByProThisMonth(){
    const proId = Number(localStorage.getItem('user_id'));
    if(!proId){
      console.log('Error fetching proId ');
      return;
    }
    this.serviceRequest.getTotalEarningsForProThisMonth(proId).subscribe({
      next:(res)=>{
        this.totalEarningsThisMonth = res;
        console.log('Total earnings this month: ', this.totalEarningsThisMonth);
        this.cdf.detectChanges();
      },
      error:(error)=>{
        console.log('Error fetching Total earnings for pro this month ', error);
      }
    })
  }

  getCompletedJobsForPro(){
    const proId = Number(localStorage.getItem('user_id'));
    if(!proId){
      console.log('Error fetching pro Id');
      return;
    }
    this.serviceRequest.getTotalServiceRequestByJobStatusAndProId(proId, 'COMPLETED').subscribe({
      next:(res)=>{
        this.totalCompletedJobs = res;
        this.cdf.detectChanges();
        console.log('Total pro completed jobs: ', this.totalCompletedJobs);
      },
      error:(err)=>{
        console.log('Error fetching completed jobs', err);
        this.cdf.detectChanges();
      }
    })
  }

  getAwaitingTotal(){
    const proId = Number(localStorage.getItem('user_id'));
    if(!proId){
      console.log('Error fetching pro Id');
      return;
    }
    this.serviceRequest.getAwaitingPaymentTotal(proId).subscribe({
      next:(res)=>{
        this.awaitingTotal = res;
        console.log('Awaiting Total Amount: ', this.awaitingTotal);
        this.cdf.detectChanges();
      },
      error: (err)=>{
        console.log('error fetching Awaiting total: ', err);
      }
    })
  }

  getListAwaitingPaymentJobs(){
    const proId = Number(localStorage.getItem('user_id'));
    if(!proId){
      console.log('Error fetching pro Id');
      return;
    }
    this.serviceRequest.getAwaitingPaymentJobs(proId).subscribe(jobs => {
    this.awaitingJobs = jobs; 
    console.log('Awaiting Total Amount: ', this.awaitingJobs);
    this.cdf.detectChanges();
    })
  }

}
