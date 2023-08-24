import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase';
import { Attachment } from './Attachment';

export interface Device extends EntityBase {
    title: string;
    titleAr: string;
    imageURL?: string;
    deviceType: string;
    image?: Attachment;
}
