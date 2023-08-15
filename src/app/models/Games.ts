import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase';
import { Attachment } from './Attachment';

export interface Games extends EntityBase {
    title: string;
    titleAr: string;
    imageURL: string;
    serviceURL: string;

    image?: Attachment;
}