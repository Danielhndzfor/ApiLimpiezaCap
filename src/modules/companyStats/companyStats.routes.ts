import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import { getCompanyStatsHandler, updateCompanyStatsHandler } from './companyStats.controller';

const router = Router();

/**
 * @openapi
 * /api/company-stats:
 *   get:
 *     summary: Obtiene las estadísticas del hero de Nosotros (años, clientes, m²)
 *     tags:
 *       - CompanyContent
 *     responses:
 *       200:
 *         description: Estadísticas
 *   put:
 *     summary: Actualiza las estadísticas
 *     tags:
 *       - CompanyContent
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Actualizado
 */
router.get('/', getCompanyStatsHandler);
router.put('/', authGuard, updateCompanyStatsHandler);

export default router;
