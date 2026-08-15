import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import { getSupervisionHandler, updateSupervisionHandler } from './supervision.controller';

const router = Router();

/**
 * @openapi
 * /api/supervision:
 *   get:
 *     summary: Obtiene el párrafo de Supervisión (Nosotros)
 *     tags:
 *       - CompanyContent
 *     responses:
 *       200:
 *         description: Contenido de Supervisión
 *   put:
 *     summary: Actualiza el párrafo de Supervisión
 *     tags:
 *       - CompanyContent
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Actualizado
 */
router.get('/', getSupervisionHandler);
router.put('/', authGuard, updateSupervisionHandler);

export default router;
