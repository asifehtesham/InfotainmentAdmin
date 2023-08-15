import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase';
import { Attachment } from './Attachment';

export interface Country extends EntityBase {
    name: string;
    nameAr: string;
    imageURL: string;
    folder: string;

    image?: Attachment;

}