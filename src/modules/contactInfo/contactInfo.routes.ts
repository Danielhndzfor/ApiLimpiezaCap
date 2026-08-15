import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import { getContactInfoHandler, updateContactInfoHandler } from './contactInfo.controller';

const router = Router();

/**
 * @openapi
 * /api/contact-info:
 *   get:
 *     summary: Obtiene los datos de contacto (teléfono, email, dirección, horario)
 *     tags:
 *       - CompanyContent
 *     responses:
 *       200:
 *         description: Datos de contacto
 *   put:
 *     summary: Actualiza los datos de contacto
 *     tags:
 *       - CompanyContent
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Actualizado
 */
router.get('/', getContactInfoHandler);
router.put('/', authGuard, updateContactInfoHandler);

export default router;
