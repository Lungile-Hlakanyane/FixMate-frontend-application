import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Job } from '../../../../shared/models/Job.model';
import { JobStatus } from '../../../../shared/models/Job.model';
import { Footer } from '../../../../shared/components/footer/footer/footer';
import { Navbar } from '../../../../shared/components/navigation-bar/navbar/navbar';
import { ServiceRequestsService } from '../../../../core/services/service-requests-service/service-requests-service';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../../core/services/auth-service/auth-service';
import { ServiceRequest } from '../../../../core/models/ServiceRequest.model';


@Component({
  selector: 'app-my-jobs-component',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, Footer],
  styleUrl: './my-jobs-component.scss',
  templateUrl: './my-jobs-component.html',
})
export class MyJobsComponent implements OnInit {

  activeFilter: JobStatus = 'all';
  selectedJob: Job | null = null;
  showDetails = false;
  isLoading = true;

  filters: { key: JobStatus; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: 0 },
    { key: 'confirmed', label: 'Confirmed', count: 0 },
    { key: 'in-progress', label: 'In Progress', count: 0 },
    { key: 'COMPLETED', label: 'Completed', count: 0 },
  ];

  jobs: Job[] = [];

  ngOnInit() {
    this.updateCounts();
    this.fetchMyJobs();
  }

  constructor(
    private requestService:ServiceRequestsService,
    private cdr:ChangeDetectorRef,
    private authService:AuthService
  ){}

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

  setFilter(key: JobStatus) {
    this.activeFilter = key;
  }

  openJob(job: Job) {
    this.selectedJob = job;
    this.showDetails = true;
  }

  closeDetails() {
    this.showDetails = false;
    this.selectedJob = null;
  }

  markComplete(job: Job) {
    const originalId = (job as any)._original?.id;
    if(!originalId) return;
    this.requestService.completeJob(originalId, 'COMPLETED').subscribe(()=>{
      job.status = 'COMPLETED';
      job.jobStatus = 'COMPLETED';
      // also update original
      if((job as any)._original) (job as any)._original.jobStatus = 'COMPLETED';
      this.updateCounts();
      this.closeDetails();
      this.cdr.detectChanges();
    });
  }

  acceptJob(job: Job) {
    job.status = 'confirmed';
    this.updateCounts();
  }

  fetchMyJobs(){
    this.isLoading = true;
    // GET logged-in proId
    let proId = this.getProId();
    if(!proId){
      console.error('No proId found');
      this.isLoading = false;
      return;
    }

    console.log(`Fetching jobs for proId: ${proId}`);

    this.requestService.getByProId(proId).subscribe({
      next: (requests: ServiceRequest[]) => {
        console.log('My jobs API:', requests);
        this.jobs = requests.map(r => this.mapToJob(r));
        this.updateCounts();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to fetch pro jobs', err);
        this.isLoading = false;
      }
    });
  }

  mapToJob(r: ServiceRequest): Job {
    // USE jobStatus first, fallback to status
    const rawStatus = (r as any).jobStatus || r.status || '';
    const s = rawStatus.toString().toLowerCase();
    let jobStatus: JobStatus = 'confirmed';
    if (s === 'pending' || s === 'open') jobStatus = 'pending';
    else if (s === 'assigned' || s === 'confirmed') jobStatus = 'confirmed';
    else if (s === 'in_progress' || s === 'in-progress') jobStatus = 'in-progress';
    else if (s === 'completed') jobStatus = 'COMPLETED';
    else if (s === 'cancelled') jobStatus = 'cancelled';
    const dateObj = r.scheduledDate ? new Date(r.scheduledDate) : null;
    const job: Job = {
      id: `FM-${r.id}`,
      customer: r.customerName,
      service: r.title,
      category: r.category,
      date: dateObj ? dateObj.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' }) : r.scheduledDate,
      time: dateObj ? dateObj.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }) : '',
      address: r.location,
      amount: r.budget > 0 ? `R${r.budget}` : 'Quote needed',
      status: jobStatus,
      jobStatus: jobStatus,
      priority: (r.urgency?.toLowerCase() === 'urgent' ? 'urgent' : 'normal') as any,
      description: r.description,
      _original: r
    } as any;
    return job;
  }

  getProId(): number | null {
    // fallback localStorage
    const stored = localStorage.getItem('user') || localStorage.getItem('currentUser') || sessionStorage.getItem('user');
    if(stored){
      try{
        const p = JSON.parse(stored);
        return p.id || p.userId || p.proId || null;
      } catch {}
    }
    return null;
  }

}
