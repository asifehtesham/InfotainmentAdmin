import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase';
import { Attachment } from './Attachment';

export interface RoomType extends EntityBase {
    title:string;
    fontType: string;
    fontColor: string;
    image?: Attachment;
    showFirstMenu: boolean;
    firstMenuCode: string;
    showSecondMenu: boolean;
    secondMenuCode: string;
    generalMenuCode: string;
    
}