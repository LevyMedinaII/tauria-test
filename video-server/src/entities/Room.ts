import User from '@entities/User';

export interface IRoom {
    name: string;
    guid: string;
    hostUser: User;
    participants: User[];
    capacity: number;
}

class Room implements IRoom {
    public name: string;
    public guid: string;
    public hostUser: User;
    public participants: User[];
    public capacity: number;

    constructor(name: string, guid: string, hostUser: User, participants?: User[], capacity: number) {
        this.name = name;
        this.guid = guid;
        this.hostUser = hostUser;
        this.participants = participants || [];
        this.capacity = capacity;
    }
}

export default Room;
