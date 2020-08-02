import { Request, Response, Router, NextFunction } from 'express';
import { BAD_REQUEST, OK, FORBIDDEN } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import moment from 'moment';

import UserDao from '@daos/User';
import UserSchema from '@schemas/User';
import { user as verifyUser } from '@shared/auth/verify';
import { FORBIDDEN_ERROR, USER_NOT_FOUND_ERROR } from '@shared/constants/errors';

const router = Router();

// Unsanitized GET users for Demo
router.get('/unsanitized', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserDao.findAll();

        return res.status(OK).json(users);
    } catch (error) {
        next(error);
    }
});

// Unsanitized GET user by username for Demo
router.get('/username/:username/unsanitized', async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params as ParamsDictionary;
    try {
        const user = await UserDao.findOne({ where: { username }});
        if (!user) {
            return res.status(BAD_REQUEST).send({ error: USER_NOT_FOUND_ERROR });
        }

        return res.status(OK).json(user);
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserDao.findAll();
        const result = users.map(user => UserSchema.fromDao(user));

        return res.status(OK).json(result);
    } catch (error) {
        next(error);
    }
});

router.get('/username/:username', async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params as ParamsDictionary;
    try {
        const user = await UserDao.findOne({ where: { username }});
        if (!user) {
            return res.status(BAD_REQUEST).send({ error: USER_NOT_FOUND_ERROR });
        }
        return res.status(OK).json(UserSchema.fromDao(user));
    } catch (error) {
        next(error);
    }
});

router.patch('/username/:username', verifyUser, async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params as ParamsDictionary;
    const { body } = req;
    const sessionUser = req.user as UserSchema;

    try {
        if (sessionUser && sessionUser.username !== username) {
            return res.status(FORBIDDEN).send({ error: FORBIDDEN_ERROR })
        } else {
            await UserDao.update(body, { where: { username }});
            return res.status(OK).end();
        }
    } catch (error) {
        next(error);
    }
});

router.delete('/username/:username', verifyUser, async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params as ParamsDictionary;
    const sessionUser = req.user as UserSchema;

    try {
        if (sessionUser && sessionUser.username !== username) {
            return res.status(FORBIDDEN).send({ error: FORBIDDEN_ERROR })
        } else {
            await UserDao.update({ dateRemoved: new Date() }, { where: { username }});
            return res.status(OK).end();
        }
    } catch (error) {
        next(error);
    }
});


export default router;
