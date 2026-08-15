import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import { getCoverageHandler, updateCoverageHandler } from './coverage.controller';

const router = Router();

/**
 * @openapi
 * /api/coverage:
 *   get:
 *     summary: Obtiene el párrafo de Cobertura (Nosotros)
 *     tags:
 *       - CompanyContent
 *     responses:
 *       200:
 *         description: Contenido de Cobertura
 *   put:
 *     summary: Actualiza el párrafo de Cobertura
 *     tags:
 *       - CompanyContent
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Actualizado
 */
router.get('/', getCoverageHandler);
router.put('/', authGuard, updateCoverageHandler);

export default router;
