import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import {
  createMilestoneHandler,
  deleteMilestoneHandler,
  getAllMilestonesHandler,
  updateMilestoneHandler,
} from './milestones.controller';

const router = Router();

/**
 * @openapi
 * /api/milestones:
 *   get:
 *     summary: Lista los hitos de la historia (Nosotros)
 *     tags:
 *       - CompanyContent
 *     responses:
 *       200:
 *         description: Listado de hitos
 *   post:
 *     summary: Crea un hito
 *     tags:
 *       - CompanyContent
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Creado
 */
router.get('/', getAllMilestonesHandler);
router.post('/', authGuard, createMilestoneHandler);

/**
 * @openapi
 * /api/milestones/{id}:
 *   put:
 *     summary: Actualiza un hito
 *     tags:
 *       - CompanyContent
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Actualizado
 *   delete:
 *     summary: Elimina un hito
 *     tags:
 *       - CompanyContent
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Eliminado
 */
router.put('/:id', authGuard, updateMilestoneHandler);
router.delete('/:id', authGuard, deleteMilestoneHandler);

export default router;
