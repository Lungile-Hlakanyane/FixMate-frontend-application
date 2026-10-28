export type Skill = string;

export interface Profesional{
  id: number;
  name: string;
  initials: string;
  role: string;
  rating: number;
  reviews: number;
  completedJobs: number;
  location: string;
  hourlyRate: number;
  skills: Skill[];
  verified: boolean;
  available: boolean;
  topRated?: boolean;
  jobs?:any;
  distance?:any;
  price?:any;
}