export type TypeOfPayment = 'CARD' | 'CASH'

export interface Payment{
    id?:number,
    jobPaidId:number,
    customerId:number,
    proId:number,
    typeOfPayment: TypeOfPayment,
    amount:number,
    dateOfPayment?:string
}