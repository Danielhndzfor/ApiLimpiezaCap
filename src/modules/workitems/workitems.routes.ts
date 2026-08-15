import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import {
  createWorkItemHandler,
  deleteWorkItemHandler,
  getAllWorkItemsHandler,
  updateWorkItemHandler,
} from './workitems.controller';

const router = Router();

/**
 * @openapi
 * /api/workitems:
 *   get:
 *     summary: Lista todos los trabajos recientes
 *     tags:
 *       - WorkItems
 *     responses:
 *       200:
 *         description: Listado de trabajos
 *   post:
 *     summary: Crea un nuevo trabajo
 *     tags:
 *       - WorkItems
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Trabajo creado
 */
router.get('/', getAllWorkItemsHandler);
router.post('/', authGuard, createWorkItemHandler);

/**
 * @openapi
 * /api/workitems/{id}:
 *   put:
 *     summary: Actualiza un trabajo
 *     tags:
 *       - WorkItems
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
 *         description: Trabajo actualizado
 *       404:
 *         description: Trabajo no encontrado
 *   delete:
 *     summary: Elimina un trabajo
 *     tags:
 *       - WorkItems
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
 *         description: Trabajo eliminado
 *       404:
 *         description: Trabajo no encontrado
 */
router.put('/:id', authGuard, updateWorkItemHandler);
router.delete('/:id', authGuard, deleteWorkItemHandler);

export default router;
