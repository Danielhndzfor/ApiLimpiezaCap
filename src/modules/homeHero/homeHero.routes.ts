import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import { getHomeHeroHandler, updateHomeHeroHandler } from './homeHero.controller';

const router = Router();

/**
 * @openapi
 * /api/home-hero:
 *   get:
 *     summary: Obtiene el contenido del hero de Inicio
 *     tags:
 *       - CompanyContent
 *     responses:
 *       200:
 *         description: Contenido del hero
 *   put:
 *     summary: Actualiza el hero de Inicio
 *     tags:
 *       - CompanyContent
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Actualizado
 */
router.get('/', getHomeHeroHandler);
router.put('/', authGuard, updateHomeHeroHandler);

export default router;
