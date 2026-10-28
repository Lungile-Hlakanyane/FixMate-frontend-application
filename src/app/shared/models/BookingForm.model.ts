export interface BookingForm{
  title?: string;
  service?: string;
  location: string;
  date: string;
  timeSlot: string;
  description: string;
  scheduledDate?:any;
  urgency?:any;
}
