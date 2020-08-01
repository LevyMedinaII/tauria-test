import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

import User from '@daos/User';
import sequelize from '@daos/db';
import { DEFAULT_ROOM_CAPACITY } from '@shared/constants/db';

interface RoomAttributes {
    name: string;
    hostUsername: string;
    capacity: number;
    guid: string;
}
  
interface RoomCreationAttributes extends Optional<RoomAttributes, "guid"> {}

class Room extends Model<RoomAttributes, RoomCreationAttributes> implements RoomAttributes {
    public name!: string;
    public hostUsername!: string;
    public capacity!: number;
    public guid!: string;
}

Room.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    hostUsername: {
        type: DataTypes.STRING,
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
    modelName: 'Room',
    timestamps: true,
});

Room.hasOne(User, { foreignKey: 'hostUsername', as: 'host'});

export default Room;
