import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase';
import { Attachment } from './Attachment';

export interface Servicerequest extends EntityBase {
    serviceId: number;
    request: string;
    requestOn?: DateTime;
    status: ServiceStatus;
    assignedTo: number,
}

export enum ServiceStatus {
    "Pending"=0,
    "InProgress"=1,
    "Closed"=2,
    "Rejected"=3,
    "CancelledByPatient"=4
}