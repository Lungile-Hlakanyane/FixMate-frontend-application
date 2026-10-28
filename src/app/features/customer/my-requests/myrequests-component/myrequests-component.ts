import { Component,HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestStatus} from '../../../../shared/models/CustomerRequest.model';
import { FormsModule } from '@angular/forms';
import { Footer } from '../../../../shared/components/footer/footer/footer';
import { Navbar } from '../../../../shared/components/navigation-bar/navbar/navbar';
import { ServiceRequestsService } from '../../../../core/services/service-requests-service/service-requests-service';
import { Router } from '@angular/router';
import { Review } from '../../../../shared/models/Review.model';
import { Experience } from '../../../../shared/models/Review.model';
import { ReviewService } from '../../../../core/services/review-service/review-service';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../core/services/auth-service/auth-service';
import { ChangeDetectorRef } from '@angular/core';
import { Payment } from '../../../../shared/models/Payment.model';
import { PaymentService } from '../../services/payment-service/payment-service';

type DetailTab = 'overview' | 'timeline';

@Component({
  selector: 'app-myrequests-component',
  standalone: true,
  imports: [CommonModule, FormsModule, Footer, Navbar],
  styleUrl: './myrequests-component.scss',
  templateUrl: './myrequests-component.html',
})
export class MyrequestsComponent implements OnInit{

  selectedStatus: RequestStatus | 'All' = 'All';
  statuses: (RequestStatus | 'All')[] = ['All', 'Pending', 'In Progress', 'Completed', 'Cancelled'];

  reviews: Review[] =[];
  loading = true;
  error= '';

  // PAY PRO MODAL STATE
  showPayProModal: boolean = false;
  paymentMethod: 'cash' | 'card' = 'cash';
  selectedCardId: string | null = null;
  showAddCardForm = false;
  isProcessingPayment = false;

  savedCards = [
   { id: 'card_1', brand: 'Visa', last4: '4242', exp: '12/27', name: 'LUNGILE M' },
   { id: 'card_2', brand: 'Mastercard', last4: '8880', exp: '08/26', name: 'LUNGILE M' }
  ];

  newCard = {
   cardNumber: '',
   expiry: '',
   cvc: '',
   holderName: ''
  };

  
  customerId:any|null = 0;
  proId:any|null =0;

  // CREATE MODAL STATE
  showCreateModal = false;
  isCreating = false;

  form:any ={
    title: '',
    description: '',
    category: 'PLUMBING',
    location: '',
    scheduledDate: '',
    budget: 0,
    urgency: 'NORMAL',
    customerId: 0
  }

  reviewForm = {
    proId: '',
    customer: this.customerId,
    stars: '',
    comment: '',
    serviceRequestId: '',
    experience: ''
  }

  categories = ['PLUMBING','ELECTRICAL','CLEANING','PAINTING','CARPENTRY','GARDENING'];
  urgencies = ['LOW','NORMAL','HIGH','URGENT'];

  // REVIEW MODAL
  showReviewModal = false;
  reviewRating = 0;
  hoverRating = 0;
  reviewComment = '';
  selectedTags: string[] = [];
  isSubmittingReview = false;
  reviewTags = ['Professional', 'On Time', 'Clean Work', 'Good Price', 'Friendly', 'Would Recommend'];

  // Contact / Details Modal State
  showContactModal = false;
  showDetailsModal = false;
  selectedRequest: any | null = null;
  activeDetailTab: DetailTab = 'overview';

  proContact = {
    phone: '+27 82 123 4567',
    whatsapp: '27821234567',
    rating: 4.9,
    jobs: 324,
    eta: '12 mins away'
  };

  requests: any[] = []; // will be filled from backend

  constructor(
    private service: ServiceRequestsService, 
    private router: Router,
    private reviewService:ReviewService,
    private authService:AuthService,
    private cdf:ChangeDetectorRef,
    private paymentService:PaymentService
  ){
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const customerId = Number(localStorage.getItem('userId'));
    this.form.customerId = user.id || 1;
  }

  ngOnInit(){
    //fetching all the requests 
    this.loadRequests();

    //fecthing all the reviews
    this.loadReviews();

    //fetch proId
    this.loadProdId();
  }

  loadRequests(){
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const customerId = user.id || this.form.customerId;

  this.service.getByCustomerId(customerId).subscribe({
    next: (data: any) => {
      const arrayData = Array.isArray(data) ? data : [data];
      this.requests = arrayData.map(d => {
        const effectiveStatus = d.jobStatus || d.status;
        return {
          id: `FM-${d.id}`,
          backendId: d.id,
          serviceTitle: d.title,
          category: d.category,
          date: d.scheduledDate?.split('T')[0] || d.createdAt?.split('T')[0],
          timeSlot: d.scheduledDate ? new Date(d.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Flexible',
          address: d.location,
          professionalName: d.proName || 'Not assigned',
          professionalInitials: d.proName ? d.proName.split(' ').map((n:string)=>n[0]).join('').slice(0,2) : '--',
          status: this.mapStatus(effectiveStatus),
          rawStatus: d.status,
          jobStatus: d.jobStatus,
          price: d.budget,
          description: d.description,
          raw: d
        }
      });
      this.cdf.detectChanges(); 
    },
    error: err => {
      console.error('Failed to load', err);
      this.cdf.detectChanges();
    }
  });
}

loadReviews():void{
  this.loading = true;
  this.reviewService.getAllReviews().subscribe({
    next: (data)=>{
      this.reviews = data;
      this.loading = false;
      console.log('Reviews fetched: ', data);
    },
    error: (err)=>{
      this.error = 'Failed to load reviews';
      this.loading = false;
      console.error(err);
    }
  })
}

mapStatus(backendStatus: string): RequestStatus {
  const s = (backendStatus || '').toUpperCase();
  switch(s){
    case 'PENDING': return 'Pending';
    case 'OPEN': return 'Pending';
    case 'ASSIGNED': return 'In Progress';
    case 'IN_PROGRESS': return 'In Progress';
    case 'COMPLETED': return 'Completed';
    case 'PAID': return 'Paid';
    case 'CANCELLED': return 'Cancelled';
    default: return 'Pending';
  }
}

  // CREATE MODAL METHODS
  openCreateModal(){
    this.showCreateModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeCreateModal(){
    this.showCreateModal = false;
    document.body.style.overflow = 'auto';
  }


  onSubmitCreate(){
    if(!this.form.title ||!this.form.location) return alert('Fill title and location');
    this.isCreating = true;
    const payload = {
     ...this.form,
      scheduledDate: this.form.scheduledDate? new Date(this.form.scheduledDate).toISOString() : new Date().toISOString()
    };
    this.service.create(payload).subscribe({
      next: () => {
        this.isCreating = false;
        this.closeCreateModal();
        this.form.title = '';
        this.form.description = '';
        this.loadRequests();
      },
      error: (err) => {
        this.isCreating = false;
        alert(err.error?.message || 'Failed to create request');
      }
    });
  }

  get filteredRequests() {
    if (this.selectedStatus === 'All') return this.requests;
    return this.requests.filter(r => r.status === this.selectedStatus);
  }

  get countByStatus() {
    return {
      all: this.requests.length,
      pending: this.requests.filter(r => r.status === 'Pending').length,
      progress: this.requests.filter(r => r.status === 'In Progress').length,
      completed: this.requests.filter(r => r.status === 'Completed').length,
    };
  }

  openContactModal(req: any) {
    this.selectedRequest = req;
    this.showContactModal = true;
    document.body.style.overflow = 'hidden';
  }


  closeContactModal() {
    this.showContactModal = false;
    document.body.style.overflow = 'auto';
  }

  callPro() { window.location.href = `tel:${this.proContact.phone}`; }
  whatsappPro() {
    const text = encodeURIComponent(`Hi ${this.selectedRequest?.professionalName}, it's about request ${this.selectedRequest?.id} - ${this.selectedRequest?.serviceTitle}`);
    window.open(`https://wa.me/${this.proContact.whatsapp}?text=${text}`, '_blank');
  }
  openChat() { alert(`Opening chat with ${this.selectedRequest?.professionalName}`); this.closeContactModal(); }

  openDetailsModal(req: any) {
    this.selectedRequest = req;
    this.activeDetailTab = 'overview';
    this.showDetailsModal = true;
    document.body.style.overflow = 'hidden';
  }
  closeDetailsModal() { this.showDetailsModal = false; document.body.style.overflow = 'auto'; }
  contactFromDetails() { this.showDetailsModal = false; this.showContactModal = true; }
  getTimeline() { /* same as yours */ return [{label: 'Request Created', time: 'Now', done: true}]; }
  openReviewModal(req: any) { this.selectedRequest = req; this.showReviewModal = true; document.body.style.overflow = 'hidden'; }
  closeReviewModal() { this.showReviewModal = false; document.body.style.overflow = 'auto'; this.isSubmittingReview = false; }
  setRating(r:number){ this.reviewRating = r; }
  toggleTag(tag:string){ if(this.selectedTags.includes(tag)) this.selectedTags = this.selectedTags.filter(t=>t!==tag); else if(this.selectedTags.length<4) this.selectedTags.push(tag); }


  submitReview(){ 
    this.isSubmittingReview = true; 
    setTimeout(()=>{ 
      this.closeReviewModal(); 
      alert('Thanks!'); }, 200);
  }

  loadProdId(){
    
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.showContactModal) this.closeContactModal();
    if (this.showDetailsModal) this.closeDetailsModal();
    if (this.showReviewModal) this.closeReviewModal();
    if (this.showCreateModal) this.closeCreateModal();
    if (this.showPayProModal) this.closePayProModal();
  }

 openPayProModal(req: any) {
  this.selectedRequest = req;
  this.showPayProModal = true;
  this.paymentMethod = 'cash'; // default
  this.selectedCardId = this.savedCards[0]?.id || null;
  this.showAddCardForm = false;
  document.body.style.overflow = 'hidden';
}

closePayProModal() {
  this.showPayProModal = false;
  document.body.style.overflow = 'auto';
  this.showAddCardForm = false;
  this.isProcessingPayment = false;
}

selectPaymentMethod(method: 'cash' | 'card') {
  this.paymentMethod = method;
}

selectCard(cardId: string) {
  this.selectedCardId = cardId;
  this.showAddCardForm = false;
}

toggleAddCardForm() {
  this.showAddCardForm = !this.showAddCardForm;
  if (this.showAddCardForm) this.selectedCardId = null;
}

saveNewCard() {
  if (!this.newCard.cardNumber || !this.newCard.expiry || !this.newCard.cvc) {
    alert('Fill all card fields');
    return;
  }
  const last4 = this.newCard.cardNumber.slice(-4);
  const newId = 'card_' + Date.now();
  this.savedCards.push({
    id: newId,
    brand: this.newCard.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
    last4: last4,
    exp: this.newCard.expiry,
    name: this.newCard.holderName.toUpperCase()
  });
  this.selectedCardId = newId;
  this.showAddCardForm = false;
  this.newCard = { cardNumber: '', expiry: '', cvc: '', holderName: '' };
}

proceedWithPayment() {
  if (this.paymentMethod === 'card' && !this.selectedCardId) {
    alert('Select a card or add new card');
    return;
  }

  if (!this.selectedRequest) return;

  this.isProcessingPayment = true;

  // Build DTO for backend
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const paymentDto: Payment = {
    jobPaidId: this.selectedRequest.backendId, // use backendId (number), not FM-xxx
    customerId: Number(localStorage.getItem('user_id')),
    proId: Number(this.selectedRequest.raw?.proId || this.selectedRequest.raw?.professionalId || 0),
    typeOfPayment: this.paymentMethod === 'cash' ? 'CASH' : 'CARD',
    amount: Number(this.selectedRequest.price),
  };

  this.paymentService.createPayment(paymentDto).subscribe({
    next: (res) => {
      console.log('Payment saved', res);
      this.isProcessingPayment = false;
      alert(`Payment ${this.paymentMethod === 'cash' ? 'marked as Cash' : 'processed with card'} for ${this.selectedRequest?.id} - R${this.selectedRequest?.price} - PAID`);
      this.closePayProModal();
      this.loadRequests(); // this will now show PAID if you map it
    },
    error: (err) => {
      this.isProcessingPayment = false;
      console.error(err);
      alert(err.error?.message || 'Payment failed');
    }
  });
}

}
