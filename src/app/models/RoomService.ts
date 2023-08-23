import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase';
import { Attachment } from './Attachment';

export interface RoomService extends EntityBase {
    title: string;
    titleAr: string;
    image?: Attachment;
}