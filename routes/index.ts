import { Router } from 'express';
import { router as usersRouter } from './users/index';

const router = Router();

router.use('/users', usersRouter);

export default router;