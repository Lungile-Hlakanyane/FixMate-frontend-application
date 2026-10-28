export interface CustomerRequest {
  id: string;
  serviceTitle: string;
  category: string;
  date: string;
  timeSlot: string;
  address: string;
  professionalName: string;
  professionalInitials: string;
  status: RequestStatus;
  price: number;
}

export type RequestStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled' | 'Paid';