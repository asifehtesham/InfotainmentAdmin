import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase';
import { Attachment } from './Attachment';

export interface News extends EntityBase {
    title: string;
    slug: string;
    content: string;

    availableStartDate: DateTime;
    availableEndDate: DateTime;
    isFeatured: boolean;
    isPublish: boolean;
    image?: Attachment;
    isActive?: boolean;
    templateSlug?: string;
}