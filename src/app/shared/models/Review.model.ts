export type Experience = 'POOR' | 'FAIR' | 'GOOD' | 'GREAT' | 'EXCELLENT'

export interface Review{
 id:number,
 proId:number,
 customerId:number,
 stars:number,
 comment:string,
 serviceRequestId:number,
 experience:Experience,
}