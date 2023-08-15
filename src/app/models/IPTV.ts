import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase';
import { Attachment } from './Attachment';

export interface IPTV extends EntityBase {
    projectID: number;
    categoryID: number;

    title: string;
    titleAr: string;
    imageURL: string;
    serviceURL: string;

    image?: Attachment;
}