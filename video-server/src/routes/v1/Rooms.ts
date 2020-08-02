import { Request, Response, Router, NextFunction } from 'express';
import { CREATED, BAD_REQUEST, OK, FORBIDDEN, NOT_FOUND, UNAUTHORIZED, UNPROCESSABLE_ENTITY } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';

import { Room as RoomDao, User as UserDao, RoomParticipants as RoomParticipantsDao } from '@daos/index';
import { user as verifyUser } from '@shared/auth/verify';
import {
    PARAM_MISSING_ERROR,
    ROOM_NOT_FOUND_ERROR,
    ROOM_FULL_ERROR,
    USER_ALREADY_A_PARTICIPANT_ERROR,
    USER_NOT_FOUND_ERROR,
    USER_NOT_A_PARTICIPANT_ERROR,
    FORBIDDEN_ERROR,
} from '@shared/constants/errors';
import UserSchema from 'src/schemas/User';
import RoomSchema from 'src/schemas/Room';

const router = Router();

// GET Rooms (For Demo)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const rooms = await RoomDao.findAll();

        return res.status(OK).json(rooms);
    } catch (error) {
        next(error);
    }
});

// GET Rooms BY host (For Demo)
router.get('/host/username/:username', async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params as ParamsDictionary;
    try {
        const user = await UserDao.findOne({ where: { username }});
        if (!user) {
            return res.status(NOT_FOUND).send({ error: USER_NOT_FOUND_ERROR });
        }
        const rooms = await RoomDao.findAll({ where: { hostId: user.id }});

        return res.status(OK).json(rooms);
    } catch (error) {
        next(error);
    }
});

router.get('/guid/:guid', async (req: Request, res: Response, next: NextFunction) => {
    const { guid } = req.params as ParamsDictionary;
    try {
        const room = await RoomDao.findOne({ where: { guid }, include: ['participants'] });
        if (!room) {
            return res.status(NOT_FOUND).send({ error: ROOM_NOT_FOUND_ERROR });
        }
        const { id, name, hostId, capacity } = room;

        // Serialize Participants Data
        const participants = (room.participants || []).map(participant => UserSchema.fromDao(participant));
        const result = new RoomSchema(id, name, guid, hostId, capacity, participants);

        return res.status(OK).json(result);
    } catch (error) {
        next(error);
    }
});

router.post('/', verifyUser, async (req: Request, res: Response, next: NextFunction) => {
    const { name, capacity }: { name: string, capacity?: number } = req.body;
    const sessionUser = req.user as UserDao;

    if (!name) {
        return res.status(BAD_REQUEST).json({
            error: PARAM_MISSING_ERROR,
        });
    }

    try {
        await RoomDao.create({
            name,
            hostId: sessionUser.id,
            ...(capacity && { capacity }),
        });

        return res.status(CREATED).end();
    } catch (error) {
        next(error);
    }
});


router.post('/join/:guid', verifyUser, async (req: Request, res: Response, next: NextFunction) => {
    const { guid } = req.params as ParamsDictionary;
    const sessionUser = req.user as UserDao;

    try {
        const room = await RoomDao.findOne({ where: { guid }, include: ['participants'] });
        if (!room) {
            return res.status(NOT_FOUND).send({ error: ROOM_NOT_FOUND_ERROR });
        }
        if (room.participants && room.participants.length >= room.capacity) {
            return res.status(UNPROCESSABLE_ENTITY).send({ error: ROOM_FULL_ERROR });
        }
        if (room.participants && room.participants.find(participant => participant.username === sessionUser.username)) {
            return res.status(UNPROCESSABLE_ENTITY).send({ error: USER_ALREADY_A_PARTICIPANT_ERROR });
        }
        await RoomParticipantsDao.create({
            userId: sessionUser.id,
            roomId: room.id,
        });

        return res.status(OK).end();
    } catch (error) {
        next(error);
    }
});

router.post('/leave/:guid', verifyUser, async (req: Request, res: Response, next: NextFunction) => {
    const { guid } = req.params as ParamsDictionary;
    const sessionUser = req.user as UserDao;

    try {
        const room = await RoomDao.findOne({ where: { guid }, include: ['participants'] });
        if (!room) {
            return res.status(NOT_FOUND).send({ error: ROOM_NOT_FOUND_ERROR });
        }
        if (room.participants && room.participants.find(participant => participant.username === sessionUser.username)) {
            await RoomParticipantsDao.destroy({
                where: {
                    userId: sessionUser.id,
                    roomId: room.id,
                },
            });
            return res.status(OK).end();
        }
        return res.status(UNPROCESSABLE_ENTITY).send({ error: USER_NOT_A_PARTICIPANT_ERROR });
    } catch (error) {
        next(error);
    }
});

router.patch('/guid/:guid/host/:username', verifyUser, async (req: Request, res: Response, next: NextFunction) => {
    const { guid, username } = req.params as ParamsDictionary;
    const { password, mobileToken } = req.body;
    const sessionUser = req.user as UserDao;

    try {
        const room = await RoomDao.findOne({ where: { guid }});
        const newHost = await UserDao.findOne({ where: { username }});
        if (!room) {
            return res.status(NOT_FOUND).send({ error: ROOM_NOT_FOUND_ERROR });
        }
        if (!newHost) {
            return res.status(NOT_FOUND).send({ error: USER_NOT_FOUND_ERROR });
        }

        if (sessionUser && sessionUser.id !== room.hostId) {
            return res.status(FORBIDDEN).send({ error: FORBIDDEN_ERROR });
        } else {
            await RoomDao.update({ hostId: newHost.id }, { where: { id: room.id } });
            return res.status(OK).end();
        }
    } catch (error) {
        next(error);
    }
});

export default router;
