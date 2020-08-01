export interface IUser {
    username: string;
    password: string;
    mobileToken?: string;
}

class User implements IUser {
    public username: string;
    public password: string;
    public mobileToken?: string;

    constructor(username: string, password: string, mobileToken?: string) {
        this.username = username;
        this.password = password;
        this.mobileToken = mobileToken;
    }
}

export default User;
