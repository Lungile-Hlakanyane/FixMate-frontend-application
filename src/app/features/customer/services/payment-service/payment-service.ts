import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Payment } from "../../../../shared/models/Payment.model";

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    private baseUrl = `http://localhost:8080/api/payments`

    constructor(private http:HttpClient){}

    //create payment
   createPayment(dto:Payment):Observable<Payment>{
     return this.http.post<Payment>(`${this.baseUrl}`, dto);
   }
   
}
