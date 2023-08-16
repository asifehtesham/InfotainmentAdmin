import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase'; 

export interface EventParticipants extends EntityBase {
    eventId:number;
    userId: number;
    username: string;
    invitationSent: number;
    invitationLink: string;
    invitedDate:DateTime|string;
    isAttented: boolean;
}