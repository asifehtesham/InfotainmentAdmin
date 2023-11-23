import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase';
import { Attachment } from './Attachment';

export interface Servicerequest extends EntityBase {
    serviceId: number;
    request: string;
    requestOn?: DateTime;
    status: ServiceStatus;
    assignedTo: number;
    roomNo?:any
}

export enum ServiceStatus {
    "Pending"=0,
    "InProgress"=1,
    "Closed"=2,
    "Rejected"=3,
    "CancelledByPatient"=4
}
export enum ComplainStatus {
    "VeryBad" = 1,
    "Poor" = 2,
    "Medium" = 3,
    "Good" = 4,
    "Excelent" = 5,

}