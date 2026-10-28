import { Component, HostListener, OnInit } from '@angular/core';
import { ServiceItem } from '../../../../shared/models/ServiceItem.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookingForm } from '../../../../shared/models/BookingForm.model';
import { Navbar } from '../../../../shared/components/navigation-bar/navbar/navbar';
import { Footer } from '../../../../shared/components/footer/footer/footer';
import { ServiceRequestsService } from '../../../../core/services/service-requests-service/service-requests-service';
import { ServiceRequestCreate } from '../../../../core/models/ServiceRequestCreate.model';
import { JobStatus } from '../../../../shared/models/Job.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-services-component',
  standalone: true,
  styleUrl: './services-component.scss',
  templateUrl: './services-component.html',
  imports: [CommonModule, FormsModule, Navbar, Footer]
})
export class ServicesComponent implements OnInit{

  searchTerm = '';
  selectedCategory = 'All';

  categories = ['All', 'Electrical', 'Plumbing', 'Cleaning', 'Appliance', 'Carpentry', 'Painting'];

   prosForService: { name: string; initials: string; role: string; rating: number; price: number }[] = [
    { name: 'Thabo Mokoena', initials: 'TM', role: 'Master Electrician', rating: 4.9, price: 250 },
    { name: 'Sarah Khumalo', initials: 'SK', role: 'Senior Technician', rating: 4.8, price: 220 },
    { name: 'James Letso', initials: 'JL', role: 'Certified Plumber', rating: 4.8, price: 220 },
  ];

  // Modal State
  showRequestModal = false;
  showDetailsModal = false;
  selectedService: ServiceItem | null = null;
  isSubmitting = false;

  bookingForm: BookingForm = {
    title: '',
    location: '12 Park Ave, Sandton, Johannesburg',
    date: '',
    timeSlot: '10:00 AM - 12:00 PM',
    description: '',
    scheduledDate: '',
    urgency:''
  };

  timeSlots = [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 02:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM'
  ];

  services: ServiceItem[] = [
    { id: 1, title: 'Electrical Repair', category: 'Electrical', description: '', priceFrom: 250, rating: 4.9, jobs: 324, shortCode: 'EL', popular: true },
    { id: 2, title: 'Plumbing Service', category: 'Plumbing', description: '', priceFrom: 200, rating: 4.8, jobs: 412, shortCode: 'PL' },
    { id: 3, title: 'Deep House Cleaning', category: 'Cleaning', description: '', priceFrom: 350, rating: 4.9, jobs: 890, shortCode: 'CL', popular: true },
    { id: 4, title: 'Appliance Fix', category: 'Electrical', description: '', priceFrom: 300, rating: 4.7, jobs: 156, shortCode: 'AP' },
    { id: 5, title: 'Carpentry Work', category: 'Carpentry', description: '', priceFrom: 280, rating: 4.8, jobs: 210, shortCode: 'CR' },
    { id: 6, title: 'House Painting', category: 'Painting', description: '', priceFrom: 800, rating: 4.8, jobs: 98, shortCode: 'PA' },
    { id: 7, title: 'AC Installation', category: 'Electrical', description: '', priceFrom: 450, rating: 4.9, jobs: 302, shortCode: 'AC' },
    { id: 8, title: 'Geyser Repair', category: 'Electrical', description: '', priceFrom: 320, rating: 4.6, jobs: 178, shortCode: 'GY' },
  ];

  urgencies = ['LOW','NORMAL','URGENT'];

  get filteredServices() {
    return this.services.filter(s => {
      const matchCat = this.selectedCategory === 'All' || s.category === this.selectedCategory;
      const matchSearch = s.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                          s.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }

  constructor(
    private serviceRequest:ServiceRequestsService,
    private router:Router
  ){}

  ngOnInit(): void {
    
  }

  navigate(link:string){
    this.router.navigateByUrl(link);
  }

  selectCategory(cat: string) {
    this.selectedCategory = cat;
  }

  requestService(service: ServiceItem) {
    console.log('Request:', service);
    // navigate to /requests/new?serviceId=...
  }

    // MODAL LOGIC
  openRequestModal(service: ServiceItem) {
    this.selectedService = service;
    this.showRequestModal = true;
    document.body.style.overflow = 'hidden'; // prevent background scroll
    // default date = tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.bookingForm.date = tomorrow.toISOString().split('T')[0];
  }

  // DETAILS MODAL
  openDetailsModal(service: ServiceItem) {
    this.selectedService = service;
    this.showDetailsModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeAllModals() {
    this.showRequestModal = false;
    this.showDetailsModal = false;
    this.selectedService = null;
    this.isSubmitting = false;
    document.body.style.overflow = 'auto';
  }

  requestFromDetails() {
    if(!this.selectedService) return;
    this.showDetailsModal = false;
    this.showRequestModal = true;
  }

  closeModal() {
    this.showRequestModal = false;
    this.selectedService = null;
    this.isSubmitting = false;
    document.body.style.overflow = 'auto';
  }

  submitRequest() {
    if (!this.bookingForm.location ||!this.bookingForm.date ||!this.selectedService) return;
    this.isSubmitting = true;
    const storedUser = JSON.parse(localStorage.getItem('user') || localStorage.getItem('currentUser') || '{}');
    const customerId = storedUser?.id || storedUser?.userId || 1; 
    const dto: ServiceRequestCreate = {
      title: this.selectedService.title,
      customerId: customerId,
      category: this.selectedService.category.toUpperCase(),
      description: this.bookingForm.description || this.selectedService.description,
      location: this.bookingForm.location,
      preferredDate: this.bookingForm.date,
      timeSlot: this.bookingForm.timeSlot,
      budget: this.selectedService.priceFrom,
      scheduledDate: this.bookingForm.scheduledDate? new Date(this.bookingForm.scheduledDate).toISOString() : new Date().toISOString(),
      urgency: this.bookingForm.urgency  
    } as any;
    this.serviceRequest.create(dto).subscribe({
      next: (res) => {
        console.log('Created:', res);
        this.isSubmitting = false;
        this.closeAllModals();
        alert(`Request #${res.id} for ${this.selectedService?.title} created!`);
        this.router.navigate(['/my-requests']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Create failed', err);
        alert('Failed: ' + (err.error?.message || err.message));
      }
    });
  }

  @HostListener('document:keydown.escape')
  onEsc() { if (this.showRequestModal || this.showDetailsModal) this.closeAllModals(); 
  }
}
