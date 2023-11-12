import { Roles } from "./Roles";

export class User {
    id: number;
    username: string;
    password?: string;
    email: string;
    mobile: string;
    title: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    token?: string;
    auth_token?: string;
    UserRoles?: Array<Roles>;
}