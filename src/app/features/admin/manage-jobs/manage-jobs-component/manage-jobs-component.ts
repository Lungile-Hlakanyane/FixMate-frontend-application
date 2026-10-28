import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Footer } from '../../../../shared/components/footer/footer/footer';
import { Navbar } from '../../../../shared/components/navigation-bar/navbar/navbar';
import { ServiceRequestsService } from '../../../../core/services/service-requests-service/service-requests-service';
import { ServiceRequest } from '../../../../core/models/ServiceRequest.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-manage-jobs-component',
  standalone: true,
  imports: [CommonModule, FormsModule, Footer, Navbar],
  styleUrl: './manage-jobs-component.scss',
  templateUrl: './manage-jobs-component.html',
})
export class ManageJobsComponent implements OnInit{


  search = '';
  activeTab: 'all' | 'open' | 'pending' | 'confirmed' | 'completed' | 'cancelled' = 'all';
  showJobModal = false;
  selectedJob: any = null;
  isLoading = true;

  constructor(
    private requestService: ServiceRequestsService,
    private cdf:ChangeDetectorRef
  ){}

  jobs: any[] = [];

 get filtered() {
    return this.jobs.filter(j => {
      const s = this.search.toLowerCase();
      const matchesSearch = 
        j.id.toLowerCase().includes(s) || 
        j.customer.toLowerCase().includes(s) || 
        j.pro.toLowerCase().includes(s) || 
        j.service.toLowerCase().includes(s);
      const matchesTab = this.activeTab === 'all' ? true : j.status === this.activeTab;
      return matchesSearch && matchesTab;
    });
  }

  get counts() {
    return {
      all: this.jobs.length,
      open: this.jobs.filter(j => j.status === 'open').length,
      pending: this.jobs.filter(j => j.status === 'pending').length,
      confirmed: this.jobs.filter(j => j.status === 'confirmed' || j.status === 'assigned').length,
      completed: this.jobs.filter(j => j.status === 'completed').length,
      cancelled: this.jobs.filter(j => j.status === 'cancelled').length,
    }
  }

  openJob(j: any) { this.selectedJob = j; this.showJobModal = true; }
  closeModal() { this.showJobModal = false; }

  updateStatus(job: any, newStatus: string) {
    const id = job.backendId;
    this.requestService.completeJob(id, newStatus.toUpperCase()).subscribe({
      next: (updated) => {
        job.status = newStatus;
        job.jobStatus = newStatus.toUpperCase();
        this.closeModal();
      },
      error: (e) => alert('Failed to update')
    });
  }

  ngOnInit(): void {
    this.fetchJobs();
  }

  fetchJobs() {
    this.isLoading = true;
    this.requestService.getAll().subscribe({
      next: (data: ServiceRequest[]) => {
        const onlyJobs = data.filter((r: any) => r.proId != null && r.proId !== 0);
        this.jobs = onlyJobs.map(r => this.mapToAdminJob(r));
        this.isLoading = false;
        this.cdf.detectChanges();
      },
      error: (err) => {
        console.error('Admin fetch failed', err);
        this.isLoading = false;
        this.cdf.detectChanges();
      }
    });
  }

   mapToAdminJob(r: ServiceRequest): any {
    const rawJobStatus = (r as any).jobStatus || 'CONFIRMED';
    const status = rawJobStatus.toLowerCase(); // confirmed, completed, etc
    const dateObj = r.scheduledDate ? new Date(r.scheduledDate) : new Date(r.createdAt);
    return {
      backendId: r.id,
      id: `FM-${r.id}`,
      customer: (r as any).customerName || `Customer ${r.customerId}`,
      pro: (r as any).proName || `Pro ${r.proId}`,
      service: r.title,
      category: r.category,
      location: r.location,
      amount: r.budget,
      status: status, // this drives tabs: completed, confirmed
      rawStatus: r.status, // ASSIGNED
      jobStatus: (r as any).jobStatus, // COMPLETED - THE FIELD YOU WANT
      date: dateObj.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' }),
      description: r.description,
      _original: r
    };
  }
}
