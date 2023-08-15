import { Binary } from '@angular/compiler';
import { MappingBase } from './MappingBase';

export interface Attachment extends MappingBase {
    data?: Array<Binary>;
    creation?: string;
    title?: string;
    size?: number;
    url?: string;

}        