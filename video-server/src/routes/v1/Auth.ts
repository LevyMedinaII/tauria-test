import bcrypt from 'bcrypt';
import { Request, Response, Router, NextFunction } from 'express';
import { BAD_REQUEST, CREATED, OK, UNAUTHORIZED } from 'http-status-codes';

import UserDao from '@daos/User';
import passport from '@shared/auth/passport';
import { SALT_ROUNDS } from '@shared/constants/auth';
import { PARAM_MISSING_ERROR, UNAUTHORIZED_ERROR } from '@shared/constants/errors';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
    const { username, password, mobileToken } = req.body;
    if (!username || !password) {
        return res.status(BAD_REQUEST).json({
            error: PARAM_MISSING_ERROR,
        });
    }

    await bcrypt.genSalt(SALT_ROUNDS, async (err, salt) => {
        await bcrypt.hash(password, salt, async (err, hash) => {
            await UserDao.create({
                username,
                password: hash,
                mobileToken,
            });
        });
    });

    return res.status(CREATED).end();
});

router.post('/login', passport.authenticate('user'), async (req: Request, res: Response) => {
    const { user } = req;
    if (!user) {
        return res.status(UNAUTHORIZED).json({
            error: UNAUTHORIZED_ERROR,
        });
    }
    return res.status(OK).end();
});

router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.logout();
        return res.status(OK).end();
    } catch (error) {
        next(error);
    }
});

export default router;
