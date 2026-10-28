import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Profesional } from '../../../../shared/models/Proffesional.model';
import { BookingForm } from '../../../../shared/models/BookingForm.model';
import { Footer } from '../../../../shared/components/footer/footer/footer';
import { Navbar } from '../../../../shared/components/navigation-bar/navbar/navbar';
import { AuthService } from '../../../../core/services/auth-service/auth-service';
import { UserResponse } from '../../../../core/models/UserResponse.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-proffesionals',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, Footer],
  styleUrl: './proffesionals.scss',
  templateUrl: './proffesionals.html',
})
export class Proffesionals implements OnInit{

  showProfileModal = false;
  activeProfileTab: 'overview' | 'reviews' = 'overview';

  // Mock detailed data - in real app fetch from API
  proDetails: any = {
  about: '10+ years licensed electrician. Specialized in residential & commercial wiring, DB boards, and emergency fault finding. Fully certified and insured.',
  skills: [
    { name: 'Wiring & Rewiring', level: 95 },
    { name: 'DB Board', level: 90 },
    { name: 'Fault Finding', level: 98 },
    { name: 'Lighting Install', level: 88 }
  ],
  reviews: [
    { name: 'Nomsa D.', rating: 5, date: '2 days ago', text: 'Thabo was amazing! Fixed my DB board in 30 mins. Very professional.' },
    { name: 'David P.', rating: 5, date: '1 week ago', text: 'On time, clean work, good price. Will definitely book again.' },
    { name: 'Lerato M.', rating: 4, date: '2 weeks ago', text: 'Good service, slightly late but work is excellent.' }
  ],
  stats: { responseTime: '15 mins', completionRate: '98%', repeatClients: '124' }
};

constructor(
  private authService:AuthService,
  private cdf:ChangeDetectorRef
){}

ngOnInit(): void {
  this.fetchProfesionals(); //fetch proffesionals
}

  showBookModal = false;
  selectedPro: Profesional | null = null;
  isSubmitting = false;

  searchTerm = '';
  selectedSkill = 'All';
  skills = ['All', 'Electrical', 'Plumbing', 'Cleaning', 'Appliance', 'Carpentry', 'Painting'];

  services = ['Electrical Repair', 'Socket Installation', 'Light Installation', 'DB Board Repair', 'Emergency Callout'];
  timeSlots = ['08:00 - 10:00 AM', '10:00 - 12:00 PM', '12:00 - 02:00 PM', '02:00 - 04:00 PM', '04:00 - 06:00 PM'];

  bookingForm: BookingForm = {
    title: '', 
    service: 'Electrical Repair',
    location: '12 Park Ave, Sandton, Johannesburg',
    date: '',
    timeSlot: '10:00 - 12:00 PM',
    description: '',
    scheduledDate: '',
  };

  get filteredPros() {
    return this.professionalsUsers.filter(p => {
      const matchSkill = this.selectedSkill === 'All' || p.occupation.includes(this.selectedSkill);
      const matchSearch = p.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          p.role.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchSkill && matchSearch;
    });
  }

   openBookModal(pro: Profesional) {
    if (!pro.available) return;
    this.selectedPro = pro;
    this.showBookModal = true;
    document.body.style.overflow = 'hidden';
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.bookingForm.date = tomorrow.toISOString().split('T')[0];
  }

  closeBookModal() {
    this.showBookModal = false;
    this.selectedPro = null;
    this.isSubmitting = false;
    document.body.style.overflow = 'auto';
  }

  submitBooking() {
    if (!this.bookingForm.date ||!this.bookingForm.location) return;
    this.isSubmitting = true;
    setTimeout(() => {
      console.log('DIRECT BOOKING', {
        professionalId: this.selectedPro?.id,
        professionalName: this.selectedPro?.name,
       ...this.bookingForm
      });
      this.closeBookModal();
      alert(`Booked ${this.selectedPro?.name} for ${this.bookingForm.service} on ${this.bookingForm.date}`);
    }, 1200);
  }

openProfileModal(pro: Profesional) {
  this.selectedPro = pro;
  this.activeProfileTab = 'overview';
  this.showProfileModal = true;
  document.body.style.overflow = 'hidden';
}

closeProfileModal() {
  this.showProfileModal = false;
  document.body.style.overflow = 'auto';
}

bookFromProfile() {
  this.showProfileModal = false;
  setTimeout(() => this.openBookModal(this.selectedPro!), 200);
}

@HostListener('document:keydown.escape')
onEsc() {
  if (this.showBookModal) this.closeBookModal();
  if (this.showProfileModal) this.closeProfileModal();
}

professionalsUsers:UserResponse[] =[];

fetchProfesionals(){
 this.authService.getUsersByRole('PRO').subscribe({
  next:(res:any)=>{
    this.professionalsUsers = res;
    console.log('Profesionals here: ', res);
    this.cdf.detectChanges();
  },
  error:(err)=>{
    console.log('Error fetching proffesionals', err);
    this.cdf.detectChanges();
  }
 })
}

}
