import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Footer } from '../../../../shared/components/footer/footer/footer';
import { Navbar } from '../../../../shared/components/navigation-bar/navbar/navbar';
import { AuthService } from '../../../../core/services/auth-service/auth-service';
import { Observable } from 'rxjs';
import { UserResponse } from '../../../../core/models/UserResponse.model';

@Component({
  selector: 'app-manage-users-component',
  standalone: true,
  imports: [CommonModule, FormsModule, Footer, Navbar],
  styleUrl: './manage-users-component.scss',
  templateUrl: './manage-users-component.html',
})
export class ManageUsersComponent implements OnInit{

  search = '';
  activeTab: 'all' | 'customer' | 'pro' | 'pending' = 'all';
  showUserModal = false;
  selectedUser: any = null;
  isLoading:boolean = false;

  //list of users to display dynamically from the backend
  users$!:Observable<UserResponse[]>;
  totalUsers$!:Observable<number>;
  totalCustomers$!:Observable<number>;
  totalPros$!:Observable<number>;
  totalAdmins$!:Observable<number>;

  constructor(private authService:AuthService){}

  users: UserResponse[]=[];

  ngOnInit(): void {
    //fething all the total number of all registered users - incl. ADMIN
    this.totalUsers$ = this.authService.getTotalUsers();

    // //fetching total numbers of users by different roles
    this.totalAdmins$ = this.authService.getTotalUsersByRole('ADMIN');
    this.totalCustomers$ = this.authService.getTotalUsersByRole('CUSTOMER');
    this.totalPros$ = this.authService.getTotalUsersByRole('PRO');
    
    this.authService.getAllUsers().subscribe({
      next: (res)=>{
        this.users = res;
        this.isLoading = false;
      },
      error:(err)=>{
        console.log('Failed to load users', err);
        this.isLoading = false;
      }
    })
  }

  get filteredUsers() {
    return this.users.filter(u => {
      const matchesSearch = u.fullName.toLowerCase().includes(this.search.toLowerCase()) || u.email.toLowerCase().includes(this.search.toLowerCase());
      const matchesTab = this.activeTab === 'all' ? true : this.activeTab === 'pending' ? u.status === 'pending' : u.role.toLocaleLowerCase() === this.activeTab;
      return matchesSearch && matchesTab;
    });
  }

  get counts() {
    return {
      all: this.users.length,
      customer: this.users.filter(u => u.role === 'CUSTOMER').length,
      pro: this.users.filter(u => u.role === 'PRO').length,
      pending: this.users.filter(u => u.status === 'pending').length,
    };
  }

  openUser(u: any) { this.selectedUser = u; this.showUserModal = true; }

  closeModal() { this.showUserModal = false; }

  toggleBan(user: UserResponse) {
    const isBanned = user.status?.toLowerCase()==='banned';
    const actions$ = isBanned? this.authService.unBanUser(user.id):this.authService.banUser(user.id);
    actions$.subscribe({
      next:(updatedUser)=>{
        const index= this.users.findIndex(u=> u.id === user.id);
        if(index!==-1){
          this.users[index] = updatedUser;
        }
      },
      error: (error)=>console.log('Failed ', error)
    });
  }

  verifyPro(user: any) {
    user.verified = true;
    user.status = 'active';
  }

  banUser(id:number){
    if(!confirm('Are you sure you want to ban this user?')){
      return
    }
    this.authService.banUser(id).subscribe({
      next:(updatedUser)=>{
        console.log('User banned: ', updatedUser);
        const index = this.users.findIndex(u=>u.id===id);
        if(index!==-1){
          this.users[index] = updatedUser;
        }
      },
      error: (err)=>{
        console.log('Failed to ban user ', err);
        alert('Failed to ban user. Contact support team.');
      }
    });
  }

  unBanUser(id:number){
    if(!confirm('Are you sure you want to un ban this user?')){
      return
    }
    this.authService.unBanUser(id).subscribe({
      next:(updatedUser)=>{
        console.log('User Unbaned: ', updatedUser);
        const index = this.users.findIndex(u=>u.id===id);
        if(index!==-1){
          this.users[index] = updatedUser;
        }
      },
      error: (err)=>{
        console.log('Failed to ban user ', err);
        alert('Failed to ban user. Contact support team.');
      }
    });
  }
}
