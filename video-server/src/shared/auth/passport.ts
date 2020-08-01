import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    const { id } = user;
    axios.db.get(`/users/${id}`, {
        params: {
            include_deleted: false
        }
    }).then((res) => {
        const user = res.data;

        if (!user) {
            throw new Error('User does not exist.');
        }

        return done(null, user);
    }).catch(err => done(err));
});

passport.use('user', new LocalStrategy(
    (username, password, done) => {
    axios.db.get(
        '/users',
        {
            params: {
                username,
            },
        },
    ).then((result) => {
        const users = result.data;

        if (!users) {
            return done(null, false);
        }

        let user = users[0];
        bcrypt.compare(password, user.password).then((res) => {
            if (res) {
                return done(null, user);
            }
            return done(null, false);
        });
    }).catch(err => done(err));
}));


export default passport;
