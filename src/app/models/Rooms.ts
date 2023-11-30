import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase'; 

export interface Rooms extends EntityBase {
    roomNo: number;
    roomTypeId:number;
    floorId: number;
    branchId: number;
    ip: string;
    status: boolean; 
    sortOrder:number;
    currentAdmission?:any;
    branch?:any
}