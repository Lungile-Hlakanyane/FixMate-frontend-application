export type JobStatus = 'all' |'open' | 'pending' | 'confirmed' | 'in-progress' | 'COMPLETED' | 'cancelled' | 'PAID' | 'ACTIVE';
export type ServiceCategory = 'PLUMBING' | 'ELECTRICAL' | 'CLEANING' | 'PAINTING' | 'CARPENTRY' | 'HANDYMAN';

import { ServiceRequest } from "../../core/models/ServiceRequest.model";

export interface Job{
  id: string;
  customer: string;
  service: string;
  category: string;
  date: string;
  time: string;
  address: string;
  amount: string;
  status: Exclude<JobStatus, 'all'>; // this will be the jobStatus
  priority: 'normal' | 'urgent';
  description: string;
  _original?: ServiceRequest;
  jobStatus?: JobStatus; // keep for template compatibility
}