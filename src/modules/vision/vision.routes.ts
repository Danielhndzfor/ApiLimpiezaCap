import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import { getVisionHandler, updateVisionHandler } from './vision.controller';

const router = Router();

/**
 * @openapi
 * /api/vision:
 *   get:
 *     summary: Obtiene el párrafo de Visión (Nosotros)
 *     tags:
 *       - CompanyContent
 *     responses:
 *       200:
 *         description: Contenido de Visión
 *   put:
 *     summary: Actualiza el párrafo de Visión
 *     tags:
 *       - CompanyContent
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Actualizado
 */
router.get('/', getVisionHandler);
router.put('/', authGuard, updateVisionHandler);

export default router;
