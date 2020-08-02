import bcrypt from 'bcrypt';
import { Request, Response, Router, NextFunction } from 'express';
import { BAD_REQUEST, CREATED, OK, UNAUTHORIZED } from 'http-status-codes';

import { User as UserDao } from '@daos/index';

import passport from '@shared/auth/passport';
import { SALT_ROUNDS } from '@shared/constants/auth';
import { PARAM_MISSING_ERROR, UNAUTHORIZED_ERROR, USER_ALREADY_EXISTS_ERROR } from '@shared/constants/errors';

const router = Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, mobileToken } = req.body;
    if (!username || !password) {
        return res.status(BAD_REQUEST).json({
            error: PARAM_MISSING_ERROR,
        });
    }

    try {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hash = await bcrypt.hash(password, salt);
        await UserDao.create({
            username,
            password: hash,
            mobileToken,
        });

        return res.status(CREATED).end();
    } catch (error) {
        next(new Error(USER_ALREADY_EXISTS_ERROR));
    }
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
