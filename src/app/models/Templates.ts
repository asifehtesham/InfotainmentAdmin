import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase';
import { Attachment } from './Attachment';

export interface Templates extends EntityBase {
    title?: string,
    slug?: string,
    html?: string,
    css?: string,
    pageData?: string,
    customCSS?:  string,
    customJS?:  string,
    cdnLinks?:  string,
}