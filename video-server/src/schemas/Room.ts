import RoomSchemaDao from '@daos/Room';
import UserSchema from './User';

export interface IRoomSchema {
    name: string;
    guid: string;
    host: UserSchema;
    capacity: number;
    participants?: UserSchema[];
}

class RoomSchema implements IRoomSchema {
    public name: string;
    public guid: string;
    public host: UserSchema;
    public capacity: number;

    public participants: UserSchema[];
    
    constructor(name: string, guid: string, host: UserSchema, capacity: number, participants?: UserSchema[]) {
        this.name = name;
        this.guid = guid;
        this.host = host;
        this.capacity = capacity;

        this.participants = participants || [];
    }
}

export default RoomSchema;
