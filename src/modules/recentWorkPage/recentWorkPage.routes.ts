import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import { getRecentWorkPageHandler, updateRecentWorkPageHandler } from './recentWorkPage.controller';

const router = Router();

router.get('/', getRecentWorkPageHandler);
router.put('/', authGuard, updateRecentWorkPageHandler);

export default router;
