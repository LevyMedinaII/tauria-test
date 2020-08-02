import { Request, Response, Router, NextFunction } from 'express';
import { OK, FORBIDDEN, NOT_FOUND } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import bcrypt from 'bcrypt';

import { User as UserDao, Room } from '@daos/index';
import UserSchema from '@schemas/User';
import RoomSchema from '@schemas/Room';
import { user as verifyUser } from '@shared/auth/verify';
import { SALT_ROUNDS } from '@shared/constants/auth';
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
            return res.status(NOT_FOUND).send({ error: USER_NOT_FOUND_ERROR });
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

router.get('/username/:username/rooms', async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params as ParamsDictionary;
    try {
        const user = await UserDao.findOne({ where: { username }, include: ['rooms']});

        if (!user) {
            return res.status(NOT_FOUND).send({ error: USER_NOT_FOUND_ERROR });
        }

        return res.status(OK).json(user.rooms);
    } catch (error) {
        next(error);
    }
});

router.get('/username/:username', async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params as ParamsDictionary;
    try {
        const user = await UserDao.findOne({ where: { username }});
        if (!user) {
            return res.status(NOT_FOUND).send({ error: USER_NOT_FOUND_ERROR });
        }
        return res.status(OK).json(UserSchema.fromDao(user));
    } catch (error) {
        next(error);
    }
});

router.patch('/username/:username', verifyUser, async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params as ParamsDictionary;
    const { password, mobileToken } = req.body;
    const sessionUser = req.user as UserDao;

    try {
        if (sessionUser && sessionUser.username !== username) {
            return res.status(FORBIDDEN).send({ error: FORBIDDEN_ERROR });
        } else {
            const salt = await bcrypt.genSalt(SALT_ROUNDS);
            const updates = {
                ...(mobileToken && { mobileToken }),
                ...(password && { password: await bcrypt.hash(password, salt) })
            };

            await UserDao.update(updates, { where: { username } });
            return res.status(OK).end();
        }
    } catch (error) {
        next(error);
    }
});

router.delete('/username/:username', verifyUser, async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params as ParamsDictionary;
    const sessionUser = req.user as UserDao;

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
