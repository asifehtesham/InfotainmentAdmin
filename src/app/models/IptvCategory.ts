import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase';
import { Attachment } from './Attachment';

export interface IptvCategory extends EntityBase {
    name: string;
    nameAr: string;
    imageURL: string;
    image?: Attachment;
}