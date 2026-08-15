import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import {
  createSecurityMeasureHandler,
  deleteSecurityMeasureHandler,
  getAllSecurityMeasuresHandler,
  updateSecurityMeasureHandler,
} from './securityMeasures.controller';

const router = Router();

/**
 * @openapi
 * /api/security-measures:
 *   get:
 *     summary: Lista las medidas de seguridad del personal (Nosotros)
 *     tags:
 *       - CompanyContent
 *     responses:
 *       200:
 *         description: Listado de medidas de seguridad
 *   post:
 *     summary: Crea una medida de seguridad
 *     tags:
 *       - CompanyContent
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Creada
 */
router.get('/', getAllSecurityMeasuresHandler);
router.post('/', authGuard, createSecurityMeasureHandler);

/**
 * @openapi
 * /api/security-measures/{id}:
 *   put:
 *     summary: Actualiza una medida de seguridad
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
 *     summary: Elimina una medida de seguridad
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
router.put('/:id', authGuard, updateSecurityMeasureHandler);
router.delete('/:id', authGuard, deleteSecurityMeasureHandler);

export default router;
