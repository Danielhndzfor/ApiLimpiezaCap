import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import { getAboutHeroHandler, updateAboutHeroHandler } from './aboutHero.controller';

const router = Router();

/**
 * @openapi
 * /api/about-hero:
 *   get:
 *     summary: Obtiene el contenido del hero de Nosotros
 *     tags:
 *       - CompanyContent
 *     responses:
 *       200:
 *         description: Contenido del hero
 *   put:
 *     summary: Actualiza el hero de Nosotros
 *     tags:
 *       - CompanyContent
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Actualizado
 */
router.get('/', getAboutHeroHandler);
router.put('/', authGuard, updateAboutHeroHandler);

export default router;
