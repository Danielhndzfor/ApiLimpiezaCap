import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import {
  createJobHandler,
  deleteJobHandler,
  getAllJobsHandler,
  getJobBySlugHandler,
  updateJobHandler,
} from './jobs.controller';

const router = Router();

/**
 * @openapi
 * /api/jobs:
 *   get:
 *     summary: Lista todas las vacantes
 *     tags:
 *       - CompanyContent
 *     responses:
 *       200:
 *         description: Listado de vacantes
 *   post:
 *     summary: Crea una vacante
 *     tags:
 *       - CompanyContent
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Vacante creada
 *       409:
 *         description: El slug ya existe
 */
router.get('/', getAllJobsHandler);
router.post('/', authGuard, createJobHandler);

/**
 * @openapi
 * /api/jobs/slug/{slug}:
 *   get:
 *     summary: Obtiene una vacante por slug
 *     tags:
 *       - CompanyContent
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vacante encontrada
 *       404:
 *         description: Vacante no encontrada
 */
router.get('/slug/:slug', getJobBySlugHandler);

/**
 * @openapi
 * /api/jobs/{id}:
 *   put:
 *     summary: Actualiza una vacante
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
 *         description: Vacante actualizada
 *       404:
 *         description: Vacante no encontrada
 *   delete:
 *     summary: Elimina una vacante
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
 *         description: Vacante eliminada
 *       404:
 *         description: Vacante no encontrada
 */
router.put('/:id', authGuard, updateJobHandler);
router.delete('/:id', authGuard, deleteJobHandler);

export default router;
