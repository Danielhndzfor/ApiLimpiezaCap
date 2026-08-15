import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import {
  createTrainingHandler,
  deleteTrainingHandler,
  getAllTrainingsHandler,
  updateTrainingHandler,
} from './trainings.controller';

const router = Router();

/**
 * @openapi
 * /api/trainings:
 *   get:
 *     summary: Lista las capacitaciones del personal operativo (Nosotros)
 *     tags:
 *       - CompanyContent
 *     responses:
 *       200:
 *         description: Listado de capacitaciones
 *   post:
 *     summary: Crea una capacitación
 *     tags:
 *       - CompanyContent
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Creada
 */
router.get('/', getAllTrainingsHandler);
router.post('/', authGuard, createTrainingHandler);

/**
 * @openapi
 * /api/trainings/{id}:
 *   put:
 *     summary: Actualiza una capacitación
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
 *         description: Actualizada
 *   delete:
 *     summary: Elimina una capacitación
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
 *         description: Eliminada
 */
router.put('/:id', authGuard, updateTrainingHandler);
router.delete('/:id', authGuard, deleteTrainingHandler);

export default router;
