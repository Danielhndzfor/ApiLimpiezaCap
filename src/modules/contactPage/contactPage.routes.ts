import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import { getContactPageHandler, updateContactPageHandler } from './contactPage.controller';

const router = Router();

/**
 * @openapi
 * /api/contact-page:
 *   get:
 *     summary: Obtiene el contenido de la página de Contacto (hero y sección Nuestra oficina)
 *     tags:
 *       - CompanyContent
 *     responses:
 *       200:
 *         description: Contenido de la página
 *   put:
 *     summary: Actualiza el contenido de la página de Contacto
 *     tags:
 *       - CompanyContent
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Actualizado
 */
router.get('/', getContactPageHandler);
router.put('/', authGuard, updateContactPageHandler);

export default router;
