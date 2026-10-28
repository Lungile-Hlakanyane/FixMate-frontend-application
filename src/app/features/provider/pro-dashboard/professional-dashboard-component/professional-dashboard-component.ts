import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Footer } from '../../../../shared/components/footer/footer/footer';
import { Navbar } from '../../../../shared/components/navigation-bar/navbar/navbar';
import { ServiceRequestsService } from '../../../../core/services/service-requests-service/service-requests-service';
import { ServiceRequest } from '../../../../core/models/ServiceRequest.model';
import { ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-professional-dashboard-component',
  standalone: true,
  imports: [CommonModule, Footer, Navbar],
  styleUrl: './professional-dashboard-component.scss',
  templateUrl: './professional-dashboard-component.html',
})
export class ProfessionalDashboardComponent implements OnInit {

  userEmail = localStorage.getItem('user_email') || 'pro@fixmate.co.za';
  activeJobsCount = 0;
  completedJobsCount = 0;
  proId!:number;
  proTotalCompletedjobs:number = 0;
  totalActiveJobs:number = 0;
  totalEarnings:number = 0;

  constructor(
    private router:Router,
    private requestService:ServiceRequestsService,
    private cdf:ChangeDetectorRef
  ){}

  stats = [
    { label: 'Active Jobs', value: this.totalActiveJobs, sub: this.totalActiveJobs, icon: 'jobs', color: 'blue', router: '/my-requests' },
    { label: 'Completed Jobs', value: this.proTotalCompletedjobs, sub: this.proTotalCompletedjobs, icon: 'check', color: 'green', },
    { label: 'Earnings', value: this.totalEarnings, sub: this.totalEarnings, icon: 'wallet', color: 'orange', router: '/earnings' },
    { label: 'Rating', value: '4.9', sub: 'Average', icon: 'star', color: 'yellow', router: '' }
  ];

  goTo(link?: string) {
    if (link) this.router.navigate([link]);
  }

  recentActivity = [
    { text: 'Job FM-1021 completed', detail: 'Plumbing - R550 paid', time: '2h ago' },
    { text: 'New request received', detail: 'Electrical - Sandton', time: '5h ago' },
    { text: 'Review received - 5 stars', detail: '"Excellent work, very professional"', time: '1d ago' },
  ];

  ngOnInit() {
    this.proId = Number(localStorage.getItem('userId'));
    this.loadActiveJobs();
    this.loadJobs();
    this.fetchProJobs();
    this.getCompletedJobs();
    this.getTotalActiveJobs();
    this.getTotalEanings();
  }

  navigate(link:string){
    this.router.navigateByUrl(link);
  }

  loadActiveJobs() {
    this.requestService.getByProId(this.proId).subscribe({
      next: (jobs) => {
        // 2. Count only active jobs - not COMPLETED/PAID/CANCELLED
        const active = jobs.filter(j => 
          j.jobStatus === 'confirmed' || 
          j.jobStatus === 'pending' || 
          j.jobStatus === 'open'
        );
        this.activeJobsCount = active.length;
        // 3. Update the stat card value
        const activeStat = this.stats.find(s => s.label === 'Active Jobs');
        if (activeStat) {
          activeStat.value = this.activeJobsCount.toString(); // e.g. '8'
          activeStat.sub = `${active.length} active`;
        }
      },
      error: (err) => console.error('Failed to load pro jobs', err)
    });
  }

  loadJobs() {
    this.requestService.getByProId(this.proId).subscribe({
      next: (jobs) => {
       // Active Jobs: OPEN, PENDING, CONFIRMED
       // Active Jobs: OPEN, PENDING, CONFIRMED
        const active = jobs.filter(j => 
       ['OPEN','PENDING','CONFIRMED'].includes(j.jobStatus as string)
      );

      // Completed Jobs: COMPLETED + PAID
        const completed = jobs.filter(j => 
       j.jobStatus === 'COMPLETED' || j.jobStatus === 'PAID'
      );

        this.activeJobsCount = active.length;
        this.completedJobsCount = completed.length;

        // Update stat cards
        const activeStat = this.stats.find(s => s.label === 'Active Jobs');
        if (activeStat) {
          activeStat.value = this.activeJobsCount.toString();
          activeStat.sub = `${this.activeJobsCount} active`;
        }

        const completedStat = this.stats.find(s => s.label === 'Completed Jobs');
        if (completedStat) {
          completedStat.value = this.completedJobsCount.toString();
          completedStat.sub = `${this.completedJobsCount} done`;
        }
      },
      error: (err) => console.error(err)
    });
  }

  proJobs:ServiceRequest[] =[];

  fetchProJobs(){
    const proId = Number(localStorage.getItem('user_id'));
    if(!proId){
      console.log('Unable to find the logged in proId ');
      return;
    }
    this.requestService.getByProId(proId).subscribe({
      next:(res:any)=>{
        this.proJobs = res;
        console.log('Pro Jobs here: ',res);
        this.cdf.detectChanges();
      },
      error:(err)=>{
        console.log('Error fetching service requests ',err);
        this.cdf.detectChanges();
      }
    })
  }

  getCompletedJobs(){
    const proId = Number(localStorage.getItem('user_id'));
    if(!proId){
      console.log('Error fetching logged in Pro ID: ');
      return;
    }
    this.requestService.getTotalServiceRequestByJobStatusAndProId(proId, 'COMPLETED').subscribe({
      next:(res)=>{
        this.proTotalCompletedjobs = res;
        console.log('Pro total completed jobs: ', this.proTotalCompletedjobs);
        this.stats[1].value = res.toString();
        this.stats[1].sub = `${res} Total`;
        this.cdf.detectChanges();
      },
      error: (err)=>{
        console.log('Failed to get pro total completed jobs ', err);
      }
    })
  }

  getTotalActiveJobs(){
    const proId = Number(localStorage.getItem('user_id'));
    if(!proId){
      console.log('Error fetching pro Id from local storage ');
      return;
    }
    this.requestService.getProActiveJobs(proId, 'ACTIVE').subscribe({
      next:(res)=>{
        this.totalActiveJobs = res;
        console.log('Active jobs: ', this.totalActiveJobs);
        this.stats[0].value = res.toString();
        this.stats[0].sub = `${res} Total`;
        this.cdf.detectChanges();
      },
      error: (err)=>{
        console.log('Error fetching total number for active jobs ');
      }
    })
  }

  getTotalEanings(){
    const proId = Number(localStorage.getItem('user_id'));
    if(!proId){
      console.log('Error fetching pro Id ');
      return;
    }
    this.requestService.getProTotalEarnings(proId).subscribe({
      next:(res)=>{
        this.totalEarnings = res;
        console.log('Total earnings: ',this.totalEarnings);
        this.stats[2].value = res.toString();
        this.stats[2].sub = `${res} Total`
        this.cdf.detectChanges();
      },
      error:(err)=>{
        console.log('Error fetching total earnings ', err);
      }
    })
  }
  
}
