import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase'; 

export interface Rooms extends EntityBase {
    roomId: number;
    roomType: string;
    floor: string;
    branch: string;
    IP: string;
    status: boolean; 
}