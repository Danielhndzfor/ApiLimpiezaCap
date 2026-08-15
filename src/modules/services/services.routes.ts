import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import {
  createServiceHandler,
  deleteServiceHandler,
  getAllServicesHandler,
  getServiceBySlugHandler,
  updateServiceHandler,
} from './services.controller';

const router = Router();

/**
 * @openapi
 * /api/services:
 *   get:
 *     summary: Lista todos los servicios
 *     tags:
 *       - Services
 *     responses:
 *       200:
 *         description: Listado de servicios
 *   post:
 *     summary: Crea un nuevo servicio
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Servicio creado
 *       409:
 *         description: El slug ya existe
 */
router.get('/', getAllServicesHandler);
router.post('/', authGuard, createServiceHandler);

/**
 * @openapi
 * /api/services/slug/{slug}:
 *   get:
 *     summary: Obtiene un servicio por slug
 *     tags:
 *       - Services
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Servicio encontrado
 *       404:
 *         description: Servicio no encontrado
 */
router.get('/slug/:slug', getServiceBySlugHandler);

/**
 * @openapi
 * /api/services/{id}:
 *   put:
 *     summary: Actualiza un servicio
 *     tags:
 *       - Services
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
 *         description: Servicio actualizado
 *       404:
 *         description: Servicio no encontrado
 *   delete:
 *     summary: Elimina un servicio
 *     tags:
 *       - Services
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
 *         description: Servicio eliminado
 *       404:
 *         description: Servicio no encontrado
 */
router.put('/:id', authGuard, updateServiceHandler);
router.delete('/:id', authGuard, deleteServiceHandler);

export default router;
