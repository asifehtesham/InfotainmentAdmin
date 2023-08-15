import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase';
import { Attachment } from './Attachment';

export interface SocialMediaType extends EntityBase {
    title: string;
    titleAr: string;
    imageURL: string;

    image?: Attachment;
}