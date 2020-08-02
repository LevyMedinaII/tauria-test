import { DataTypes, Optional, Model } from 'sequelize';
import sequelize from '@daos/db';

interface RoomParticipantsAttributes {
    id: number;
    userId: number;
    roomId: number;
}

interface RoomParticipantsCreationAttributes {
    userId: number;
    roomId: number;
}

class RoomParticipants extends Model<RoomParticipantsAttributes, RoomParticipantsCreationAttributes> implements RoomParticipantsAttributes {
    public id!: number;
    public userId!: number;
    public roomId!: number;
}

RoomParticipants.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id',
        }
    },
    roomId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Rooms',
            key: 'id',
        }
    },
}, {
    sequelize,
    timestamps: true,
    modelName: 'RoomParticipants',
});

export default RoomParticipants;