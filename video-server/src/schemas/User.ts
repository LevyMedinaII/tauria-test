import UserDao from '@daos/User';
import User from '@daos/User';

export interface IUserSchema {
    username: string;
    mobileToken?: string;
}

class UserSchema implements IUserSchema {
    public username: string;
    public mobileToken?: string;

    constructor(username: string, mobileToken?: string) {
        this.username = username;
        this.mobileToken = mobileToken;
    }

    public static fromDao(model: UserDao): UserSchema {
        const { username, mobileToken } = model;

        return new UserSchema(username, mobileToken);
    }
}

export default UserSchema;
