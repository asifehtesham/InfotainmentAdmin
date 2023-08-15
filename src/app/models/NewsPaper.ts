import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase';
import { Attachment } from './Attachment';

export interface NewsPaper extends EntityBase {
    countryID: number;

    title: string;
    titleAr: string;
    imageURL: string;
    serviceURL: string;

    image?: Attachment;
}