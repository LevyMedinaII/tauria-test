import { Router } from 'express';
import RoomRouter from './Rooms';
import UserRouter from './Users';
import AuthRouter from './Auth';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/rooms', RoomRouter);
router.use('/users', UserRouter);
router.use('/', AuthRouter);

// Export the base-router
export default router;
