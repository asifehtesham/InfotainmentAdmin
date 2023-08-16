import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase'; 
import { User } from '../models/Users';

export interface Events extends EntityBase {
    galleyId:number;
    title: string;
    description: string;
    color: string;
    organizer:string;
    allDay: boolean;
    location_URL:string;
    startDate: any;
    status:string;
    endDate: any;
    parentEventId: number;
    invitedUsers: User;
    isRecursive: boolean;
    isPublic:boolean
}