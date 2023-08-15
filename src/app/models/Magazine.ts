import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase';
import { Attachment } from './Attachment';

export interface Magazine extends EntityBase {
    countryID: number;

    title: string;
    titleAr: string;
    imageURL: string;
    serviceURL: string;

    image?: Attachment;
}