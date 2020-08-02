import { Request, Response, NextFunction } from 'express';
import { UNAUTHORIZED } from 'http-status-codes';
import { UNAUTHORIZED_ERROR } from '@shared/constants/errors';

export const user = (req: Request, res: Response, next: NextFunction) => {
    const { user: sessionUser } = req;
    if (!sessionUser) {
        res.status(UNAUTHORIZED).send(UNAUTHORIZED_ERROR);
    }
    next();
};
