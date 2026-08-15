import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import { getMissionHandler, updateMissionHandler } from './mission.controller';

const router = Router();

/**
 * @openapi
 * /api/mission:
 *   get:
 *     summary: Obtiene el párrafo de Misión (Nosotros)
 *     tags:
 *       - CompanyContent
 *     responses:
 *       200:
 *         description: Contenido de Misión
 *   put:
 *     summary: Actualiza el párrafo de Misión
 *     tags:
 *       - CompanyContent
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Actualizado
 */
router.get('/', getMissionHandler);
router.put('/', authGuard, updateMissionHandler);

export default router;
