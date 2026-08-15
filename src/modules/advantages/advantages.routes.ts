import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import {
  createAdvantageHandler,
  deleteAdvantageHandler,
  getAllAdvantagesHandler,
  updateAdvantageHandler,
} from './advantages.controller';

const router = Router();

/**
 * @openapi
 * /api/advantages:
 *   get:
 *     summary: Lista las ventajas competitivas (Inicio)
 *     tags:
 *       - CompanyContent
 *     responses:
 *       200:
 *         description: Listado de ventajas
 *   post:
 *     summary: Crea una ventaja
 *     tags:
 *       - CompanyContent
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Creada
 */
router.get('/', getAllAdvantagesHandler);
router.post('/', authGuard, createAdvantageHandler);

/**
 * @openapi
 * /api/advantages/{id}:
 *   put:
 *     summary: Actualiza una ventaja
 *     tags:
 *       - CompanyContent
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Actualizada
 *   delete:
 *     summary: Elimina una ventaja
 *     tags:
 *       - CompanyContent
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Eliminada
 */
router.put('/:id', authGuard, updateAdvantageHandler);
router.delete('/:id', authGuard, deleteAdvantageHandler);

export default router;
