import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import {
  createEquipmentHandler,
  deleteEquipmentHandler,
  getAllEquipmentHandler,
  updateEquipmentHandler,
} from './equipment.controller';

const router = Router();

/**
 * @openapi
 * /api/equipment:
 *   get:
 *     summary: Lista el equipamiento de la empresa (Nosotros)
 *     tags:
 *       - CompanyContent
 *     responses:
 *       200:
 *         description: Listado de equipamiento
 *   post:
 *     summary: Crea un elemento de equipamiento
 *     tags:
 *       - CompanyContent
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Creado
 */
router.get('/', getAllEquipmentHandler);
router.post('/', authGuard, createEquipmentHandler);

/**
 * @openapi
 * /api/equipment/{id}:
 *   put:
 *     summary: Actualiza un elemento de equipamiento
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
 *     summary: Elimina un elemento de equipamiento
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
router.put('/:id', authGuard, updateEquipmentHandler);
router.delete('/:id', authGuard, deleteEquipmentHandler);

export default router;
