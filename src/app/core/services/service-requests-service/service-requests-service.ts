import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceRequest } from '../../models/ServiceRequest.model';
import { ServiceRequestCreate } from '../../models/ServiceRequestCreate.model';
import { ReviewStatus } from '../../models/ServiceRequest.model';
import { JobStatus } from '../../../shared/models/Job.model';
import { ServiceCategory } from '../../../shared/models/Job.model';

@Injectable({
    providedIn:'root'
})
export class ServiceRequestsService {

    private baseUrl = `http://localhost:8080/api/service-requests`;

    constructor(private http:HttpClient){}

    //create a request
    create(dto:ServiceRequestCreate):Observable<ServiceRequest>{
        return this.http.post<ServiceRequest>(this.baseUrl,dto);
    }

    //fetch all created requests
    getAll():Observable<ServiceRequest[]>{
        return this.http.get<ServiceRequest[]>(this.baseUrl);
    }

    //fetch request byId
    getById(id:number):Observable<ServiceRequest>{
        return this.http.get<ServiceRequest>(`${this.baseUrl}/${id}`);
    }

    // fetching the requests by using the customerId
    getByCustomerId(customerId: number): Observable<any[]> {
     return this.http.get<any[]>(`${this.baseUrl}/customer/${customerId}`);
    }

    //fetch by proId
    getByProId(proId:number):Observable<ServiceRequest[]>{
        return this.http.get<ServiceRequest[]>(`${this.baseUrl}/pro/${proId}`);
    }

    //assign pro
    assignPro(proId:number, requestId:number):Observable<ServiceRequest>{
        return this.http.put<ServiceRequest>(`${this.baseUrl}/${requestId}/assign/${proId}`,{})
    }

    //update status
    updateStatus(id: number, status: string): Observable<ServiceRequest> {
     const params = new HttpParams().set('status', status);
      return this.http.put<ServiceRequest>(`${this.baseUrl}/${id}/status`, {}, { params });
    }

    //delete by id
    delete(id:number):Observable<void>{
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

    //fetch total requests
    getTotalRequests():Observable<number>{
        return this.http.get<number>(`${this.baseUrl}/total`);
    }

    //change serviceReviewStatus by Id
    approveServiceRequest(id:number, reviewStatus: ReviewStatus):Observable<ServiceRequest>{
        return this.http.put<ServiceRequest>(`${this.baseUrl}/${id}/reviewStatus/${reviewStatus}`, {});
    }

    //change serviceReviewStatus by Id
    flagServiceRequest(id:number, reviewStatus: ReviewStatus):Observable<ServiceRequest>{
        return this.http.put<ServiceRequest>(`${this.baseUrl}/${id}/reviewStatus/${reviewStatus}`, {});
    }

    //change serviceReviewStatus by Id
    rejectServiceRequest(id:number, reviewStatus: ReviewStatus):Observable<ServiceRequest>{
        return this.http.put<ServiceRequest>(`${this.baseUrl}/${id}/reviewStatus/${reviewStatus}`, {});
    }

    //count by status
    getCountByStatus(status:JobStatus):Observable<number>{
        return this.http.get<number>(`${this.baseUrl}/countByStatus/${status}`);
    }

    //get total number for completed jobs for pro
    getTotalServiceRequestByJobStatusAndProId(proId:number, jobStatus:JobStatus):Observable<number>{
        return this.http.get<number>(`${this.baseUrl}/total-completed-jobs/${proId}/${jobStatus}`);
    }

    //complete job
    completeJob(requestId:number, jobStatus:string):Observable<ServiceRequest>{
      const params = new HttpParams().set('jobStatus', jobStatus);
      return this.http.put<ServiceRequest>(`${this.baseUrl}/requests/${requestId}`, {}, { params });
    }

    // Also add for admin
    getAllJobs(): Observable<ServiceRequest[]> {
     return this.http.get<ServiceRequest[]>(this.baseUrl);
    }

    //count by service category
    getCountByServiceCategory(category:ServiceCategory): Observable<number>{
        return this.http.get<number>(`${this.baseUrl}/countByJobCategory/${category}`);
    }

    //pay job
    payPro(id:number,jobStatus:JobStatus):Observable<ServiceRequest>{
        const params = new HttpParams().set('jobStatus',jobStatus);
        return this.http.put<ServiceRequest>(`${this.baseUrl}/pay/${id}`, {});
    }

    //count active jobs
    getProActiveJobs(proId:number, jobStatus:JobStatus):Observable<number>{
        return this.http.get<number>(`${this.baseUrl}/active-jobs/${proId}/${jobStatus}`);
    }

    //get total earnings for pro
    getProTotalEarnings(proId: number):Observable<number>{
        return this.http.get<number>(`${this.baseUrl}/pro/${proId}/total-paid`);
    }

    //get paid transactions by proId
    getPaidServiceByPro(id:number, PAID: JobStatus): Observable<ServiceRequest[]> {
        return this.http.get<ServiceRequest[]>(`${this.baseUrl}/pro/${id}/status/${PAID}`);
    }

    //getTotalEarnings for a pro this month
    getTotalEarningsForProThisMonth(proId:number):Observable<number>{
        return this.http.get<number>(`${this.baseUrl}/pro/${proId}/this-month`);
    }

    // get awaiting payment jobs
    getAwaitingPaymentJobs(proId: number): Observable<ServiceRequest[]> {
       return this.http.get<ServiceRequest[]>(`${this.baseUrl}/pro/${proId}/awaiting-payment`);
    }

    //get total number for awaiting payment jobs
    getAwaitingPaymentTotal(proId: number): Observable<number> {
       return this.http.get<number>(`${this.baseUrl}/pro/${proId}/awaiting-payment/total`);
    }

}
