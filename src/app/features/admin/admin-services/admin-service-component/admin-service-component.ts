import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Footer } from '../../../../shared/components/footer/footer/footer';
import { Navbar } from '../../../../shared/components/navigation-bar/navbar/navbar';
import { ServiceRequestsService } from '../../../../core/services/service-requests-service/service-requests-service';
import { Observable } from 'rxjs';
import { JobStatus } from '../../../../shared/models/Job.model';
import { ServiceCategory } from '../../../../shared/models/Job.model';
import { ServiceRequest } from '../../../../core/models/ServiceRequest.model';

@Component({
  selector: 'app-admin-service-component',
  standalone: true,
  imports: [CommonModule, FormsModule, Footer, Navbar],
  styleUrl: './admin-service-component.scss',
  templateUrl: './admin-service-component.html',
})
export class AdminServiceComponent implements OnInit{

  services$!:Observable<number>;
  plumbingServices$!:Observable<number>;
  electricalServices$!:Observable<number>;

  search = '';
  activeCategory: string = 'all';

  setCategory(id: string) {
   this.activeCategory = id;
  }

  showModal = false;
  editing: any = null;
  isEditing = false;
  isLoading = true;

categories = [
  { id: 'all', label: 'All' },
  { id: 'plumbing', label: 'Plumbing' },
  { id: 'electrical', label: 'Electrical' },
  { id: 'painting', label: 'Painting' },
  { id: 'cleaning', label: 'Cleaning' },
  { id: 'carpentry', label: 'Carpentry' },
] as const;

  mostRequested: { label: string, jobs: number, pros: number } = { label: '—', jobs: 0, pros: 0 };

  services: any[] = [];
  private allRequests: ServiceRequest[] = [];

  form = { name: '', category: 'plumbing', icon: 'NS', basePrice: 0, maxPrice: 0, duration: '', description: '', status: 'active' };

  get filtered() {
    return this.services.filter(s => {
      const matchCat = this.activeCategory === 'all' ? true : s.category === this.activeCategory;
      const matchSearch = s.name.toLowerCase().includes(this.search.toLowerCase()) || 
                          s.description?.toLowerCase().includes(this.search.toLowerCase());
      return matchCat && matchSearch;
    });
  }

  get counts() {
    return {
      all: this.services.length,
      plumbing: this.services.filter(s => s.category === 'plumbing').length,
      electrical: this.services.filter(s => s.category === 'electrical').length,
      active: this.services.filter(s => s.status === 'active').length,
    }
  }

  openAdd() {
    this.isEditing = false;
    this.form = { name: '', category: 'plumbing', icon: '🔧', basePrice: 350, maxPrice: 1000, duration: '1 hr', description: '', status: 'active' };
    this.showModal = true;
  }

  openEdit(s: any) {
    this.isEditing = true;
    this.editing = s;
    this.form = {...s };
    this.showModal = true;
  }

  closeModal() { this.showModal = false; }

  save() {
    if (this.isEditing && this.editing) {
      Object.assign(this.editing, this.form);
    } else {
      this.services.unshift({ id: Date.now(), pros: 0,...this.form });
    }
    this.closeModal();
  }

  toggleStatus(s: any) { s.status = s.status === 'active'? 'inactive' : 'active'; }
  deleteService(s: any) { if(confirm(`Delete ${s.name}?`)) this.services = this.services.filter(x => x.id!== s.id); }

  constructor(private serviceRequest:ServiceRequestsService){

  }

  ngOnInit(): void {
    this.getTotalServiceRequests();
    this.getPlumbingTotalNumber('PLUMBING');
    this.getElectricalTotalNumber('ELECTRICAL');
    this.fetchRealServices();
  }

  getTotalServiceRequests(){
    this.services$ = this.serviceRequest.getTotalRequests();
  }

  getPlumbingTotalNumber(category:ServiceCategory){
    this.plumbingServices$ =this.serviceRequest.getCountByServiceCategory(category);
  }

  getElectricalTotalNumber(category:ServiceCategory){
    this.electricalServices$ = this.serviceRequest.getCountByServiceCategory(category);
  }

    fetchRealServices(){
    this.isLoading = true;
    this.serviceRequest.getAll().subscribe({
      next: (data: ServiceRequest[]) => {
        this.allRequests = data;
        
        this.services = data.map(r => ({
          id: r.id,
          backendId: r.id,
          name: r.title,
          category: (r.category || '').toLowerCase(),
          rawCategory: r.category,
          icon: this.getIcon(r.category),
          basePrice: r.budget,
          maxPrice: r.budget,
          duration: this.getDuration(r.scheduledDate),
          pros: (r as any).proId ? 1 : 0,
          proName: (r as any).proName || 'Unassigned',
          status: 'active',
          jobStatus: (r as any).jobStatus,
          requestStatus: r.status,
          description: r.description,
          location: r.location,
          urgency: r.urgency,
          proId: (r as any).proId,
          customerId: r.customerId,
          date: r.scheduledDate
        }));

        this.calculateMostRequested(data);
        this.isLoading = false;
      },
      error: err => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  getIcon(cat: string): string {
    switch(cat){
      case 'PLUMBING': return '🚰';
      case 'ELECTRICAL': return '⚡';
      case 'CLEANING': return '🧹';
      case 'PAINTING': return '🎨';
      case 'CARPENTRY': return '🪚';
      default: return '🔧';
    }
  }

  getDuration(dateStr: string): string {
    if(!dateStr) return 'Flexible';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' });
  }

  calculateMostRequested(data: ServiceRequest[]){
    if(!data.length){
      this.mostRequested = { label: 'No data', jobs: 0, pros: 0 };
      return;
    }
    // Group by category
    const countMap = new Map<string, { count: number, pros: Set<any>, exampleTitle: string }>();
    data.forEach(r => {
      const cat = r.category || 'UNKNOWN';
      if(!countMap.has(cat)){
        countMap.set(cat, { count: 0, pros: new Set(), exampleTitle: r.title });
      }
      const entry = countMap.get(cat)!;
      entry.count++;
      if((r as any).proId) entry.pros.add((r as any).proId);
    });
    // Find dominant
    let maxCat = '';
    let maxData = { count: 0, pros: new Set(), exampleTitle: '' };
    countMap.forEach((val, key) => {
      if(val.count > maxData.count){
        maxData = val;
        maxCat = key;
      }
    });
    this.mostRequested = {
      label: maxCat, // PLUMBING
      jobs: maxData.count, // 1
      pros: maxData.pros.size // 1 pro for this example: pro_id 4
    };
  }

}
