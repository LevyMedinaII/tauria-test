import { DataTypes, Optional, Model } from 'sequelize';
import sequelize from '@daos/db';

interface UserAttributes {
    username: string;
    password: string;
    mobileToken?: string;
    dateRemoved?: Date;
  }
  
interface UserCreationAttributes extends Optional<UserAttributes, "username"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public username!: string;
    public password!: string;
    public mobileToken?: string;
    public dateRemoved?: Date;
}

User.init({
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
    modelName: 'User',
    timestamps: true,
});

export default User;