import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

import sequelize from '@daos/db';
import User from './User';
import { DEFAULT_ROOM_CAPACITY } from '@shared/constants/db';

interface RoomAttributes {
    id: number;
    name: string;
    hostId: number;
    capacity: number;
    guid: string;
    participants?: User[];
}

interface RoomCreationAttributes {
    name: string;
    hostId: number;
    capacity?: number;
}

class Room extends Model<RoomAttributes, RoomCreationAttributes> implements RoomAttributes {
    public id!: number;
    public name!: string;
    public hostId!: number;
    public capacity!: number;
    public guid!: string;
    public participants?: User[];
}

Room.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    hostId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: DEFAULT_ROOM_CAPACITY,
    },
    guid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: uuidv4(),
    },
}, {
    sequelize,
    timestamps: true,
});

export default Room;
