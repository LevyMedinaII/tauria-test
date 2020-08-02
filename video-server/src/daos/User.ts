import { DataTypes, Optional, Model } from 'sequelize';
import sequelize from '@daos/db';

interface RoomAttributes {
    id: number;
    name: string;
    hostId: number;
    capacity: number;
    guid: string;
    participants?: User[];
}

interface UserAttributes {
    id: number;
    username: string;
    password: string;
    mobileToken?: string;
    dateRemoved?: Date;
    rooms?: RoomAttributes[];
}

interface UserCreationAttributes {
    username: string;
    password: string;
    mobileToken?: string;
    dateRemoved?: Date;
}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public username!: string;
    public password!: string;
    public mobileToken?: string;
    public dateRemoved?: Date;
    public rooms?: RoomAttributes[];
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mobileToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dateRemoved: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    sequelize,
    timestamps: true,
});

export default User;