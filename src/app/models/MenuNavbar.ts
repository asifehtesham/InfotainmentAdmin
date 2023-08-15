import { Attachment } from './Attachment';
import { EntityBase } from './EntityBase';

export interface MenuNavbar extends EntityBase {
    parentId: number;
    title: string;
    url:string;
    children?:Array< MenuNavbar>;
    isActive?:boolean;
    parent?:MenuNavbar;

}