import { Request, Response, NextFunction } from 'express';
import { UNAUTHORIZED } from 'http-status-codes';
import { UNAUTHORIZED_ERROR } from '@shared/constants/errors';
import UserSchema from '@schemas/User';

export const user = (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    if (!user) {
        res.status(UNAUTHORIZED).send(UNAUTHORIZED_ERROR);
    }
    next();
};

export const sameUser = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserSchema;
    if (!user) {
        res.status(UNAUTHORIZED).send(UNAUTHORIZED_ERROR);
    }

    next();
};
