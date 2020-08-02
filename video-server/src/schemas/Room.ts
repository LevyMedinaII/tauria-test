import UserSchema from './User';

export interface IRoomSchema {
    id: number;
    name: string;
    guid: string;
    hostId: number;
    capacity: number;
    participants?: UserSchema[];
}

class RoomSchema implements IRoomSchema {
    public id: number;
    public name: string;
    public guid: string;
    public hostId: number;
    public capacity: number;

    public participants: UserSchema[];

    constructor(id: number, name: string, guid: string, hostId: number, capacity: number, participants?: UserSchema[]) {
        this.id = id;
        this.name = name;
        this.guid = guid;
        this.hostId = hostId;
        this.capacity = capacity;

        this.participants = participants || [];
    }
}

export default RoomSchema;
