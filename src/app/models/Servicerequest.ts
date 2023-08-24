import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase';
import { Attachment } from './Attachment';

export interface Servicerequest extends EntityBase {
    patientId: number;
    serviceId: number;
    roomNo: number;
    request: string;
    requestOn?: DateTime;
    status: ServiceStatus;
    assignedTo: number,
    admissionNo: string, 
    patientName: string, 
}

export enum ServiceStatus {
"Pending"=1,
"InProgress"=2,
"Closed"=3,
"Rejected"=4,
"CancelledByPatient"=5
}