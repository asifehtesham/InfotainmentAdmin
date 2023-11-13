import { User } from "./Users";

export class Cohort {
    id: number;
    cohortName: string;
    visible: boolean;
    description?: string;
    users?: User;
    noofusers?:any;
    
}