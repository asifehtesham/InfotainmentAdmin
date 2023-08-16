import { Events } from '../models/Events';
import { DateTime } from 'luxon';
 
import { EntityBase } from './EntityBase'; 

export interface RecurrenceEvent extends EntityBase{
    pattern: number,
    endAfter: number,
    endBy: DateTime,
    repeatEvery: number,
    repeatOn: number,
    repeatOnWeekDays: any,
    repeatOnMonth: number,
    event:Events;
    
}