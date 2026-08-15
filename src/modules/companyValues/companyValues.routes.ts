import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import {
  createCompanyValueHandler,
  deleteCompanyValueHandler,
  getAllCompanyValuesHandler,
  updateCompanyValueHandler,
} from './companyValues.controller';

const router = Router();

/**
 * @openapi
 * /api/values:
 *   get:
 *     summary: Lista los valores de la empresa (Nosotros)
 *     tags:
 *       - CompanyContent
 *     responses:
 *       200:
 *         description: Listado de valores
 *   post:
 *     summary: Crea un valor
 *     tags:
 *       - CompanyContent
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Creado
 */
router.get('/', getAllCompanyValuesHandler);
router.post('/', authGuard, createCompanyValueHandler);

/**
 * @openapi
 * /api/values/{id}:
 *   put:
 *     summary: Actualiza un valor
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
 *     summary: Elimina un valor
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
router.put('/:id', authGuard, updateCompanyValueHandler);
router.delete('/:id', authGuard, deleteCompanyValueHandler);

export default router;
