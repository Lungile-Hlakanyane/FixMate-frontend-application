export type Role = 'CUSTOMER' | 'PRO' | 'ADMIN';

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  idNumber?: string;
  role: Role;
  verified: boolean; 
  active: boolean; 
  status?:string;
  createdAt: string;
  jobs?:any;
  avatar?:any;
  occupation?:any;
  available?:any;
  biography?:any;
  initials?:any;
  rating?:any;
  reviews?:any;
  completedJobs?:any;
}