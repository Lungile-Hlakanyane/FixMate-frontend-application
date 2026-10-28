import { JobStatus } from '../../shared/models/Job.model';
export type ReviewStatus = 'APPROVE' | 'FLAG' | 'REJECT';

export interface ServiceRequest{
    id:number;
    title:string;
    description:string;
    category:string;
    location:string;
    status:string;
    scheduledDate:string;
    budget:number;
    urgency:string;
    createdAt:string;
    customerId:number;
    customerName:string;
    proId?:number;
    proName?:string;
    reviewStatus?:ReviewStatus;
    jobStatus?:JobStatus;
}