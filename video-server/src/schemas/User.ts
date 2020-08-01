export interface IUserSchema {
    username: string;
    mobileToken?: string;
}

class UserSchema implements IUserSchema {
    public username: string;
    public mobileToken?: string;

    constructor(username: string, password: string, mobileToken?: string) {
        this.username = username;
        this.mobileToken = mobileToken;
    }
}

export default UserSchema;
