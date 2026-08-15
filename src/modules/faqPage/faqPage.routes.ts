import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import { getFaqPageHandler, updateFaqPageHandler } from './faqPage.controller';

const router = Router();

router.get('/', getFaqPageHandler);
router.put('/', authGuard, updateFaqPageHandler);

export default router;
