import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Job } from '../../../../shared/models/Job.model';
import { Footer } from '../../../../shared/components/footer/footer/footer';
import { Navbar } from '../../../../shared/components/navigation-bar/navbar/navbar';
import { JobStatus } from '../../../../shared/models/Job.model';
import { CommonModule } from '@angular/common';
import { ServiceRequestsService } from '../../../../core/services/service-requests-service/service-requests-service';
import { Observable } from 'rxjs';
import { ServiceRequest } from '../../../../core/models/ServiceRequest.model';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../../core/services/auth-service/auth-service';


@Component({
  selector: 'app-prorequests-component',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, Footer],
  styleUrl: './prorequests-component.scss',
  templateUrl: './prorequests-component.html',
})
export class ProrequestsComponent implements OnInit{

  activeFilter: JobStatus = 'all';
  selectedJob: Job | null = null;
  showDetails = false;
  isLoading = true;

  totalRequests$!:Observable<number>;

  filters: { key: JobStatus; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: 0 },
    { key: 'pending', label: 'Pending', count: 0 },
    { key: 'confirmed', label: 'Confirmed', count: 0 },
  ];

  jobs: Job[] = []; //this is empty will fill it from API

  constructor(
    private router:Router,
    private serviceRequests:ServiceRequestsService,
    private cdr:ChangeDetectorRef,
    private authService:AuthService
  ){}

  ngOnInit(): void {
    //fetch the total number of requests 
    this.totalRequests$ = this.serviceRequests.getTotalRequests();

    //fetch all the total requests
    this.fetchAllRequests();
  }

  navigate(link:string){
    this.router.navigateByUrl(link)
  }

  updateCounts() {
    this.filters.forEach(f => {
      if (f.key === 'all') f.count = this.jobs.length;
      else f.count = this.jobs.filter(j => j.status === f.key).length;
    });
  }

  get filteredJobs() {
    if (this.activeFilter === 'all') return this.jobs;
    return this.jobs.filter(j => j.status === this.activeFilter);
  }

  setFilter(key: JobStatus) { this.activeFilter = key; }
  openJob(job: Job) { this.selectedJob = job; this.showDetails = true; }
  closeDetails() { this.showDetails = false; this.selectedJob = null; }

  markComplete(job: Job) {
    const originalId = (job as any)._original?.id;
    if(!originalId) return;
    this.serviceRequests.completeJob(originalId, 'COMPLETED').subscribe(()=>{
      job.status = 'COMPLETED';
      this.updateCounts();
      this.closeDetails();
    });
  }

  acceptJob(job: Job) {
  const requestId = (job as any)._original?.id;
  if(!requestId) return;

  // 1. Get logged-in proId - try these in order
  let proId: number | null = null;

  // Option B: fallback from localStorage / sessionStorage
  if(!proId){
    const stored = localStorage.getItem('user') || localStorage.getItem('currentUser') || sessionStorage.getItem('user');
    if(stored){
      const parsed = JSON.parse(stored);
      proId = parsed.id || parsed.userId || parsed.proId;
    }
  }

  // Option C: temporary hardcode for testing if above fails
  // proId = 5; // <- uncomment to test, then remove

  if(!proId){
    alert('Could not find your Pro ID. Please log in again.');
    console.error('proId is null. Check AuthService / localStorage');
    return;
  }

  console.log(`Assigning request ${requestId} to pro ${proId}`);

  // 2. Call assignPro -> backend should set jobStatus to ASSIGNED/CONFIRMED and proId
  job.status = 'confirmed'; // optimistic update for UI
  this.updateCounts();

  this.serviceRequests.assignPro(proId, requestId).subscribe({
    next: (updatedRequest) => {
      console.log('Assigned successfully:', updatedRequest);
      // update with real response
      this.jobs = this.jobs.map(j => j.id === job.id ? this.mapToJob(updatedRequest) : j);
      this.updateCounts();
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Assign failed', err);
      alert('Failed to accept job: ' + (err.error?.message || err.message));
      // rollback
      job.status = 'pending';
      this.updateCounts();
    }
  });
}

  countByJobStatusPending(){
    this.serviceRequests.getCountByStatus('pending').subscribe(c=>{
      this.filters[0].count = c;
    })
  }

  fetchAllRequests(){
    this.isLoading = true;
    console.log('Fetching /api/service-requests...');
    this.serviceRequests.getAll().subscribe({
      next: (requests: ServiceRequest[]) => {
        console.log('API DATA:', requests); // you should see your 1 item
        this.jobs = requests.map(r => this.mapToJob(r));
        console.log('MAPPED JOBS:', this.jobs);
        this.updateCounts();
        this.isLoading = false;
        this.cdr.detectChanges(); // force render
      },
      error: (err) => {
        console.error('Failed to fetch requests', err);
        this.isLoading = false;
      }
    });
  }

 mapToJob(r: ServiceRequest): Job {
    let jobStatus: JobStatus = 'pending';
    const s = (r.status || r.status || '').toLowerCase();
    if (s === 'confirmed' || s === 'assigned') jobStatus = 'confirmed';
    else if (s === 'in_progress' || s === 'in-progress') jobStatus = 'in-progress';
    else if (s === 'COMPLETED') jobStatus = 'COMPLETED';
    else if (s === 'open') jobStatus = 'pending'; // your API returns OPEN + PENDING
    else jobStatus = 'pending';
    const dateObj = r.scheduledDate ? new Date(r.scheduledDate) : null;
    return {
      id: `FM-${r.id}`,
      customer: r.customerName || `Customer #${r.customerId}`,
      service: r.title,
      category: r.category,
      date: dateObj ? dateObj.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' }) : r.scheduledDate,
      time: dateObj ? dateObj.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }) : '',
      address: r.location,
      amount: r.budget > 0 ? `R${r.budget}` : 'Quote needed',
      status: jobStatus as any,
      priority: (r.urgency?.toLowerCase() === 'urgent' ? 'urgent' : 'normal') as any,
      description: r.description,
      _original: r
    } as any;
  }

}
