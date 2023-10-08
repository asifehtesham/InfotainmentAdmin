import { User } from "./Users";

export class Cohort {
    id: number;
    name: string;
    isVisible: boolean;
    description?: string;
    users?: User;
    noofusers?:any;
}