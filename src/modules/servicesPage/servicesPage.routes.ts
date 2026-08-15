import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import { getServicesPageHandler, updateServicesPageHandler } from './servicesPage.controller';

const router = Router();

router.get('/', getServicesPageHandler);
router.put('/', authGuard, updateServicesPageHandler);

export default router;
