import { Permission } from "./Permission";

export class Roles {
    id: number;
    title: string;
    Permissions: Array<Permission>;
}