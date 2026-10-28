export interface ServiceRequestCreate{
    title:string;
    description:string;
    category:string;
    location:string;
    scheduledDate:string;
    budget:number;
    urgency:string;
    customerId:number;
}