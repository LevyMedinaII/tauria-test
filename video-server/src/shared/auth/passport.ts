import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import UserDao from '@daos/User';
import { ACCOUNT_CLOSED_ERROR, USER_NOT_FOUND_ERROR } from '@shared/constants/errors';

passport.serializeUser((user: UserDao, done) => {
    done(null, user);
});

passport.deserializeUser(async (user: UserDao, done) => {
    const { username } = user;
    const userInstance = await UserDao.findOne({ where: { username }});
    if (!userInstance) {
        return done(new Error(USER_NOT_FOUND_ERROR));
    }
    if (userInstance.dateRemoved) {
        return done(null, null);
    }
    return done(null, userInstance);
});

passport.use('user', new LocalStrategy(async (username: string, password: string, done) => {
    const userInstance = await UserDao.findOne({ where: { username }});
    if (!userInstance) {
        return done(null, false);
    }
    if (userInstance.dateRemoved) {
        return done(new Error(ACCOUNT_CLOSED_ERROR), false);
    }
    const isPasswordEqual = await bcrypt.compare(password, userInstance.password);
    if (isPasswordEqual) {
        return done(null, userInstance);
    }
    return done(null, false);
}));


export default passport;
