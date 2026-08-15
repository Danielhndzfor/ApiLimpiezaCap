import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import {
  createTestimonialHandler,
  deleteTestimonialHandler,
  getAllTestimonialsHandler,
  updateTestimonialHandler,
} from './testimonials.controller';

const router = Router();

/**
 * @openapi
 * /api/testimonials:
 *   get:
 *     summary: Lista todos los testimonios
 *     tags:
 *       - Testimonials
 *     responses:
 *       200:
 *         description: Listado de testimonios
 *   post:
 *     summary: Crea un nuevo testimonio
 *     tags:
 *       - Testimonials
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Testimonio creado
 */
router.get('/', getAllTestimonialsHandler);
router.post('/', authGuard, createTestimonialHandler);

/**
 * @openapi
 * /api/testimonials/{id}:
 *   put:
 *     summary: Actualiza un testimonio
 *     tags:
 *       - Testimonials
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
 *         description: Testimonio actualizado
 *       404:
 *         description: Testimonio no encontrado
 *   delete:
 *     summary: Elimina un testimonio
 *     tags:
 *       - Testimonials
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
 *         description: Testimonio eliminado
 *       404:
 *         description: Testimonio no encontrado
 */
router.put('/:id', authGuard, updateTestimonialHandler);
router.delete('/:id', authGuard, deleteTestimonialHandler);

export default router;
