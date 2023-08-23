import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase';
import { Attachment } from './Attachment';

export interface Servicerequest extends EntityBase {
    patientId: number;
    serviceId: number;
    roomNo: number;
    request: string;
    requestOn?: DateTime;
    serviceRequestStatus: string;
    assignedTo: string
}