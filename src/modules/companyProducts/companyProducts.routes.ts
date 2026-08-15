import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import { getCompanyProductsHandler, updateCompanyProductsHandler } from './companyProducts.controller';

const router = Router();

/**
 * @openapi
 * /api/company-products:
 *   get:
 *     summary: Obtiene el párrafo de Productos (Nosotros)
 *     tags:
 *       - CompanyContent
 *     responses:
 *       200:
 *         description: Contenido de Productos
 *   put:
 *     summary: Actualiza el párrafo de Productos
 *     tags:
 *       - CompanyContent
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Actualizado
 */
router.get('/', getCompanyProductsHandler);
router.put('/', authGuard, updateCompanyProductsHandler);

export default router;
