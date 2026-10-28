import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Footer } from '../../../../shared/components/footer/footer/footer';
import { Navbar } from '../../../../shared/components/navigation-bar/navbar/navbar';
import { Router } from '@angular/router';
import { Pipe, PipeTransform } from '@angular/core';
import { ServiceRequest } from '../../../../core/models/ServiceRequest.model';
import { ServiceRequestsService } from '../../../../core/services/service-requests-service/service-requests-service';
import { JobStatus } from '../../../../shared/models/Job.model';
import { ChangeDetectorRef } from '@angular/core';

@Pipe({ name: 'filterStatus', standalone: true })
export class FilterStatusPipe implements PipeTransform {
  transform(items: any[], status: string) { return items.filter(i => i.status === status).length; }
}

@Component({
  selector: 'app-admin-payouts-component',
  standalone: true,
  imports: [CommonModule, FormsModule, Footer, Navbar, FilterStatusPipe],
  styleUrl: './admin-payouts-component.scss',
  templateUrl: './admin-payouts-component.html',
})
export class AdminPayoutsComponent implements OnInit{

  constructor(
    private router:Router,
    private requestService:ServiceRequestsService,
    private cdf:ChangeDetectorRef
  ){}

  ngOnInit(): void {
   this.fetchPayouts();
  }

  search = '';
  activeTab: 'all' | 'pending' | 'paid' | 'failed' = 'all';
  showPayoutModal = false;
  selectedPayout: any = null;
  isLoading = true;

  payouts:any[] = [];

  get filtered() {
    return this.payouts.filter(p => {
      const s = this.search.toLowerCase();
      const matchSearch = p.pro.toLowerCase().includes(s) || p.id.toLowerCase().includes(s) || p.email.toLowerCase().includes(s) || p.jobId.toLowerCase().includes(s);
      const matchTab = this.activeTab === 'all' ? true : p.status === this.activeTab;
      return matchSearch && matchTab;
    });
  }

  get totals() {
    const pending = this.payouts.filter(p => p.status === 'pending');
    const paid = this.payouts.filter(p => p.status === 'paid');
    return {
      pendingAmount: pending.reduce((a,b) => a + b.net, 0),
      paidAmount: paid.reduce((a,b) => a + b.net, 0),
      pendingCount: pending.length,
      all: this.payouts.length
    }
  }

  openPayout(p: any) { this.selectedPayout = p; this.showPayoutModal = true; }
  closeModal() { this.showPayoutModal = false; }
  markFailed(p: any) { p.status = 'failed'; }
  approveAllPending() { this.payouts.forEach(p => { if(p.status==='pending') p.status='paid'; }); }
  navigate(link:string){this.router.navigateByUrl(link)};


  fetchPayouts(){
    this.isLoading = true;
    this.requestService.getAll().subscribe({
      next: (data: ServiceRequest[]) => {
        // ONLY COMPLETED JOBS WITH PRO = PAYOUTS
        const jobsForPayout = data.filter((r: any) => 
          r.proId != null && 
          (r.jobStatus === 'COMPLETED' || r.jobStatus === 'PAID')
        );
        this.payouts = jobsForPayout.map((r: any) => {
          const budget = Number(r.budget) || 0;
          const fee = +(budget * 0.20).toFixed(2); // 20%
          const net = +(budget * 0.80).toFixed(2); // 80% to pro
          // Payout status logic: if job_status is COMPLETED = pending, if PAID = paid
          const payoutStatus = r.jobStatus === 'COMPLETED' ? 'pending' : r.jobStatus === 'PAID' ? 'paid' : 'pending';
          return {
            backendId: r.id,
            id: `PY-${r.id}`, // Payout ID from request ID
            jobId: `FM-${r.id}`,
            pro: r.proName || `Pro ${r.proId}`,
            email: r.proEmail || `pro${r.proId}@fixmate.co.za`,
            amount: budget, // Gross = budget from your table: 300
            fee: fee, // 6
            net: net, // 294
            jobs: 1, // each request = 1 job payout
            method: 'Bank • Capitec',
            status: payoutStatus,
            date: r.updatedAt ? new Date(r.updatedAt).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
            avatar: (r.proName || 'P').substring(0,2).toUpperCase(),
            title: r.title, // Leaking kitchen tap
            location: r.location,
            _original: r
          };
         
        });
        this.isLoading = false;
        this.cdf.detectChanges();
      },
      error: err => {
        console.error(err);
        this.isLoading = false;
        this.cdf.detectChanges();
      }
    });
  }

  approve(p: any) { 
    const newStatus = 'PAID' as JobStatus;
    this.requestService.payPro(p.backendId, newStatus).subscribe({
      next: (updatedRequest)=>{
        console.log('Pro paid: ', updatedRequest);
        p.status = 'paid';
        this.closeModal();
      },
      error: (err)=>{
        console.log('Pay failed', err);
        alert('Failed to pay pro');
      }
    })
  }
}
