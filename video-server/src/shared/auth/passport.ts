import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import UserDao from '@daos/User';
import UserSchema from '@schemas/User';
import { USER_NOT_FOUND_ERROR } from '@shared/constants/errors';

passport.serializeUser((user: UserSchema, done) => {
    done(null, user);
});

passport.deserializeUser(async (user: UserSchema, done) => {
    const { username } = user;
    const userInstance = await UserDao.findOne({ where: { username }});
    if (!userInstance) {
        return done(new Error(USER_NOT_FOUND_ERROR));
    }
    return done(null, user);
});

passport.use('user', new LocalStrategy(async (username: string, password: string, done) => {
    const userInstance = await UserDao.findOne({ where: { username }});
    if (!userInstance) {
        return done(null, false);
    }
    const isPasswordEqual = await bcrypt.compare(password, userInstance.password);
    if (isPasswordEqual) {
        return done(null, userInstance);
    }
    return done(null, false);
}));


export default passport;
