import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase'; 

export interface PatientAdmission extends EntityBase {
    admissionNo: number;
    fileNo: string;
    branchId: number;
    roomNo: number;
    admitDate: DateTime;
    assignedDoctor:string;
    patientName:string;
    mobile:string;
    age:number;
    gender:number;
    status: number; 
}