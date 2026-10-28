export type Role = 'CUSTOMER' | 'PRO' | 'ADMIN';

export interface UserRegistrationRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  idNumber?: string | null;
  role: Role;
}