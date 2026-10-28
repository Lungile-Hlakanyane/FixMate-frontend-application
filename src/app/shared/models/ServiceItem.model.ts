export interface ServiceItem {
  id: number;
  title: string;
  category: string;
  description: string;
  priceFrom: number;
  rating: number;
  jobs: number;
  icon?: string;
  popular?: boolean;
  shortCode?:any;
  includes?:any;
}