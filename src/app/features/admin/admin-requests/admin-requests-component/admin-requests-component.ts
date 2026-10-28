import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Footer } from '../../../../shared/components/footer/footer/footer';
import { Navbar } from '../../../../shared/components/navigation-bar/navbar/navbar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ServiceRequestsService } from '../../../../core/services/service-requests-service/service-requests-service';
import { ServiceRequest } from '../../../../core/models/ServiceRequest.model';
import { ReviewStatus } from '../../../../core/models/ServiceRequest.model';

@Component({
  selector: 'app-admin-requests-component',
  standalone: true,
  imports: [FormsModule, CommonModule, Footer, Navbar],
  styleUrl: './admin-requests-component.scss',
  templateUrl: './admin-requests-component.html',
})
export class AdminRequestsComponent implements OnInit{

  search = '';
  activeTab: string = 'all';
  showModal = false;
  selected: any = null;
  assignProId: string = '';
  isLoading:boolean = false;

  approve: ReviewStatus = 'APPROVE';
  flag: ReviewStatus = 'FLAG';
  reject:ReviewStatus = 'REJECT'

  totalRequests$!:Observable<number>;

  pros = [
    { id: 'p1', name: 'David Molefe', skill: 'Plumbing', rating: 4.9 },
    { id: 'p2', name: 'John Plumbing', skill: 'Plumbing', rating: 4.7 },
    { id: 'p3', name: 'Mike Electrical', skill: 'Electrical', rating: 4.8 },
  ];

  requests:ServiceRequest[]=[];

  get filtered() {
    return this.requests.filter(r => {
      const matchTab = this.activeTab === 'all'? true : r.status === this.activeTab;
      const s = this.search.toLowerCase();
      const matchSearch = r.description.toLowerCase().includes(s) || r.customerName.toLowerCase().includes(s) || r.title.toLowerCase().includes(s);
      return matchTab;
    });
  }

  get counts() {
    return {
      all: this.requests.length,
      new: this.requests.filter(r => r.status === 'new').length,
      approved: this.requests.filter(r => r.status === 'approved').length,
      flagged: this.requests.filter(r => r.status === 'flagged').length,
      rejected: this.requests.filter(r => r.status === 'rejected').length,
    }
  }

  setTab(t: string) { this.activeTab = t; }
  openRequest(r: any) { this.selected = r; this.showModal = true; this.assignProId = ''; }
  closeModal() { this.showModal = false; }

  // approve(r: any) { r.status = 'approved'; }
  // reject(r: any) { r.status = 'rejected'; this.closeModal(); }
  // flag(r: any) { r.status = 'flagged'; }

  assignPro() {
    if (!this.assignProId ||!this.selected) return;
    const pro = this.pros.find(p => p.id === this.assignProId);
    this.selected.status = 'approved';
    this.selected.assignedPro = pro?.name;
    this.closeModal();
  }

  constructor(
    private router:Router,
    private serviceRequests:ServiceRequestsService
  ){}

  ngOnInit(): void {
    //fetch the total requests
    this.totalRequests$ = this.serviceRequests.getTotalRequests();

    //fetch all total requested created
    this.getAllRequests();
  }

  navigate(link:string){
    this.router.navigateByUrl(link);
  }

  getAllRequests(){
    this.serviceRequests.getAll().subscribe({
      next:(res)=> {
        this.requests = res;
        this.isLoading = false;
      },
      error:(error)=>{
        console.log('Failed to load requests');
        this.isLoading = false;
      }
    },
   )
  }

  approveServiceRequest(id:number){
    this.serviceRequests.approveServiceRequest(id,this.approve).subscribe({
      next:(res)=>{
        console.log('Approved service request: '+res);
        this.closeModal();
      },error(err) {
        console.log('Failed to approve the service request', err);
      },
    })
  }

  flagServiceRequest(id:number){
    this.serviceRequests.flagServiceRequest(id,this.flag).subscribe({
      next:(res)=>{
        console.log('Flag service request: '+res);
        this.closeModal();
      },error(err) {
        console.log('Failed to failed the service request', err);
      },
    })
  }

  rejectServiceRequest(id:number){
    this.serviceRequests.rejectServiceRequest(id, this.reject).subscribe({
      next:(res)=>{
        console.log('Reject service request: '+res);
        this.closeModal();
      },error(err) {
        console.log('Failed to reject the service request', err);
      },
    })
  }

}

