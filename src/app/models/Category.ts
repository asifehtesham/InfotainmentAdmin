import { Attachment } from './Attachment';
import { EntityBase } from './EntityBase';

export interface Category extends EntityBase {
    parentId: number;
    title: string;
    children?:Array< Category>;
    isActive?:boolean;
    parent?:Category;

}