import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import { getAllNavLinksHandler, updateNavLinkHandler } from './navLinks.controller';

const router = Router();

/**
 * @openapi
 * /api/nav-links:
 *   get:
 *     summary: Lista los enlaces del menú principal
 *     tags:
 *       - CompanyContent
 *     responses:
 *       200:
 *         description: Listado de enlaces
 *   put:
 *     summary: Renombra un enlace del menú (usa linkKey en el body, no se pueden crear/eliminar)
 *     tags:
 *       - CompanyContent
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Actualizado
 */
router.get('/', getAllNavLinksHandler);
router.put('/', authGuard, updateNavLinkHandler);

export default router;
