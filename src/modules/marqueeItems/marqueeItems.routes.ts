import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import {
  createMarqueeItemHandler,
  deleteMarqueeItemHandler,
  getAllMarqueeItemsHandler,
  moveMarqueeItemDownHandler,
  moveMarqueeItemUpHandler,
  reorderMarqueeItemsHandler,
  updateMarqueeItemHandler,
} from './marqueeItems.controller';

const router = Router();

/**
 * @openapi
 * /api/marquee-items:
 *   get:
 *     summary: Lista los items del marquee (banner de texto en movimiento, Inicio)
 *     tags:
 *       - CompanyContent
 *     responses:
 *       200:
 *         description: Listado de items del marquee
 *   post:
 *     summary: Crea un item del marquee
 *     tags:
 *       - CompanyContent
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Creado
 */
router.get('/', getAllMarqueeItemsHandler);
router.post('/', authGuard, createMarqueeItemHandler);

/**
 * @openapi
 * /api/marquee-items/reorder:
 *   put:
 *     summary: Reordena todos los items del marquee (drag and drop)
 *     tags:
 *       - CompanyContent
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Orden actualizado
 */
router.put('/reorder', authGuard, reorderMarqueeItemsHandler);

/**
 * @openapi
 * /api/marquee-items/{id}:
 *   put:
 *     summary: Actualiza un item del marquee
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
 *         description: Actualizado
 *   delete:
 *     summary: Elimina un item del marquee
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
 *         description: Eliminado
 */
router.put('/:id', authGuard, updateMarqueeItemHandler);
router.delete('/:id', authGuard, deleteMarqueeItemHandler);

/**
 * @openapi
 * /api/marquee-items/{id}/move-up:
 *   put:
 *     summary: Sube de posición un item del marquee
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
 *         description: Movido
 * /api/marquee-items/{id}/move-down:
 *   put:
 *     summary: Baja de posición un item del marquee
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
 *         description: Movido
 */
router.put('/:id/move-up', authGuard, moveMarqueeItemUpHandler);
router.put('/:id/move-down', authGuard, moveMarqueeItemDownHandler);

export default router;
