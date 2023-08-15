import { DateTime } from 'luxon';
import { EntityBase } from './EntityBase';

export interface Option extends EntityBase {

    pollId: number,
    title: string;
    content: string; 
    sortId: number;
    votes: number;
}
    

  