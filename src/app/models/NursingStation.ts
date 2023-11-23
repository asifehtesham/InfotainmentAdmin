import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase'; 
import { Rooms } from 'src/app/models/Rooms';

export interface NursingStation extends EntityBase {
    floorId: number;
    title: string;
    inchargeUserId:number;
    assignRooms?: Rooms;
}