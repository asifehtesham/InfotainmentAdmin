import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase';

export interface ServiceLinks extends EntityBase {

    serviceId: number,
    title: string;
    link: string; 
    sortId: number;
}
    

  