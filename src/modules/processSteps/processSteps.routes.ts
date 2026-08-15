import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import {
  createProcessStepHandler,
  deleteProcessStepHandler,
  getAllProcessStepsHandler,
  updateProcessStepHandler,
} from './processSteps.controller';

const router = Router();

router.get('/', getAllProcessStepsHandler);
router.post('/', authGuard, createProcessStepHandler);
router.put('/:id', authGuard, updateProcessStepHandler);
router.delete('/:id', authGuard, deleteProcessStepHandler);

export default router;
