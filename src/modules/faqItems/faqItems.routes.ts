import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import {
  createFaqItemHandler,
  deleteFaqItemHandler,
  getAllFaqItemsHandler,
  updateFaqItemHandler,
} from './faqItems.controller';

const router = Router();

/**
 * @openapi
 * /api/faq-items:
 *   get:
 *     summary: Lista las preguntas frecuentes
 *     tags:
 *       - CompanyContent
 *     responses:
 *       200:
 *         description: Listado de preguntas
 *   post:
 *     summary: Crea una pregunta frecuente
 *     tags:
 *       - CompanyContent
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Creada
 */
router.get('/', getAllFaqItemsHandler);
router.post('/', authGuard, createFaqItemHandler);

/**
 * @openapi
 * /api/faq-items/{id}:
 *   put:
 *     summary: Actualiza una pregunta frecuente
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
 *     summary: Elimina una pregunta frecuente
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
router.put('/:id', authGuard, updateFaqItemHandler);
router.delete('/:id', authGuard, deleteFaqItemHandler);

export default router;
