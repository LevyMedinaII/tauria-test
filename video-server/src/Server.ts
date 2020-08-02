import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

import express, { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST, OK } from 'http-status-codes';
import session from 'express-session';
import 'express-async-errors';

import passport from '@shared/auth/passport';
import logger from '@shared/helpers/Logger';
import V1Router from './routes/v1';

// Init express
const app = express();

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({ secret: 'api3000', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

// Add APIs
app.use('/v1', V1Router);
app.get('/ping', async (req: Request, res: Response) => {
    return res.status(OK).send('pong').end();
});

// Print API errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
        error: err.message,
    });
});

// Export express instance
export default app;
