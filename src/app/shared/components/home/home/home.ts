import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ServiceRequestsService } from '../../../../core/services/service-requests-service/service-requests-service';
import { ServiceRequest } from '../../../../core/models/ServiceRequest.model';

@Component({
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
  standalone: false
})
export class Home implements OnInit{

  requests:ServiceRequest[]=[];
  isLoading:boolean = false;

  constructor(
    private serviceRequest:ServiceRequestsService,
    private cdf:ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.fetchCustomerRequests();
  }

  fetchCustomerRequests(){
    const customerId = Number(localStorage.getItem('user_id'));
    if(!customerId){
      console.log('Error fetching the currently logged in userId');
      return;
    }
    this.isLoading = true;
    this.serviceRequest.getByCustomerId(customerId).subscribe({
      next: (res)=>{
        this.requests = res;
        this.isLoading = false;
        this.cdf.detectChanges(); // <--- FIX IS HERE
        console.log('Requests: ', this.requests);
      },
      error:(err)=>{
        console.log('Error fecthing customer requests', err);
        this.isLoading = false;
        this.cdf.detectChanges();
      }
    })
  }
}
