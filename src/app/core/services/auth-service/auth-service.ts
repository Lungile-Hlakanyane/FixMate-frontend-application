import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRegistrationRequest } from '../../models/UserRegistrationRequest.model';
import { UserResponse } from '../../models/UserResponse.model';
import { LoginRequest } from '../../models/LoginRequest.model';
import { Role } from '../../models/UserRegistrationRequest.model';
import { switchMap, map } from 'rxjs';

@Injectable({
    providedIn:'root'
})
export class AuthService {

   private baseUrl = `http://localhost:8080/api/users`;

   constructor(private http:HttpClient){}

    // POST /api/users
   register(request: UserRegistrationRequest): Observable<UserResponse> {
     return this.http.post<UserResponse>(`${this.baseUrl}`, request);
   }

   // GET /api/users
   getAllUsers(): Observable<UserResponse[]> {
     return this.http.get<UserResponse[]>(`${this.baseUrl}`);
   }

   // GET /api/users/total/{role}
   getTotalByRole(role: Role): Observable<number> {
     return this.http.get<number>(`${this.baseUrl}/total/${role}`);
   }

   // PUT /api/users/{id}/toggle
   toggleActive(id: number): Observable<UserResponse> {
     return this.http.put<UserResponse>(`${this.baseUrl}/${id}/toggle`, {});
   }

   // PUT /api/users/{id}/verify
   verifyPro(id: number): Observable<UserResponse> {
     return this.http.put<UserResponse>(`${this.baseUrl}/${id}/verify`, {});
   }

   // DELETE /api/users/{id}
   deleteUserById(id: number): Observable<void> {
     return this.http.delete<void>(`${this.baseUrl}/${id}`);
   }

   //Login method
  login(email: string, password: string): Observable<UserResponse> {
    // 1. Call login endpoint
    return this.http.post<{message: string} | UserResponse>(`${this.baseUrl}/auth/login`, { email, password }).pipe(
      // 2. If backend still returns only message, fetch user list to find role
      switchMap((res: any) => {
        if (res.role) {
          // backend already returns UserResponse - new version
          return new Observable<UserResponse>(observer => {
            observer.next(res as UserResponse);
            observer.complete();
          });
        } else {
          // old version - get user by email
          return this.getUserByEmail(email);
        }
      })
    );
  }

  //get user by email
  private getUserByEmail(email: string): Observable<UserResponse> {
    return this.http.get<UserResponse[]>(`${this.baseUrl}`).pipe(
      map(users => {
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) throw new Error('User not found');
        return user;
      })
    );
  }

  //save session in the localStorage
  saveSession(user: UserResponse) {
   localStorage.setItem('user_id', user.id.toString());
   localStorage.setItem('user_role', user.role.toLowerCase()); // <-- lowercase
   localStorage.setItem('user_email', user.email);
   localStorage.setItem('user', JSON.stringify(user));
  }


  //get user role
  getRole(): Role | null {
    return localStorage.getItem('user_role') as Role;
  }

  //getTotal number users registered in the application
  getTotalUsers():Observable<number>{
    return this.http.get<number>(`${this.baseUrl}/overallTotal`);
  }

  //fetch get total users by different roles
  getTotalUsersByRole(role: Role):Observable<number>{
    return this.http.get<number>(`${this.baseUrl}/total/${role}`);
  }

  //ban user
  banUser(id:number):Observable<UserResponse>{
    return this.http.put<UserResponse>(`${this.baseUrl}/banUser/${id}`,{});
  }

  //Uban user
  unBanUser(id:number):Observable<UserResponse>{
    return this.http.put<UserResponse>(`${this.baseUrl}/unBanUser/${id}`,{});
  }
  
  //get user by id
  getUserById(id:number):Observable<UserResponse>{
    return this.http.get<UserResponse>(`${this.baseUrl}/${id}`);
  }

  //update user by Id
  updateUserById(userId:number, dto:UserResponse):Observable<UserResponse>{
    return this.http.put<UserResponse>(`${this.baseUrl}/${userId}`, dto);
  }

  //fetch users by role
  getUsersByRole(role:Role):Observable<UserResponse>{
    return this.http.get<UserResponse>(`${this.baseUrl}/role/${role}`);
  }

}
