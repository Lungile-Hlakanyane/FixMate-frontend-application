import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review} from '../../../shared/models/Review.model';

@Injectable({
    providedIn: 'root'
})
export class ReviewService {

    private baseUrl = `http://localhost:8080/api/reviews`;

    constructor(private http:HttpClient){}

    //create review
    createReview(dto:Review):Observable<Review>{
        return this.http.post<Review>(this.baseUrl,dto);
    }

    //get by Id
    getReviewById(id:number):Observable<Review>{
        return this.http.get<Review>(`${this.baseUrl}/${id}`);
    }

    //get all reviews
    getAllReviews():Observable<Review[]>{
        return this.http.get<Review[]>(`${this.baseUrl}`);
    }

    //update review by id
    updateReviewById(id:number):Observable<Review>{
        return this.http.put<Review>(`${this.baseUrl}`,{});
    }

    //delete by id
    deleteReviewById(id:number):Observable<void>{
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
