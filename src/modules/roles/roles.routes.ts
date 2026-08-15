import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import {
  createRoleHandler,
  deleteRoleHandler,
  getAllRolesHandler,
  getRoleByIdHandler,
  updateRoleHandler,
} from './roles.controller';

const router = Router();

/**
 * @openapi
 * /api/roles:
 *   get:
 *     summary: Lista todos los roles
 *     tags:
 *       - Roles
 *     responses:
 *       200:
 *         description: Listado de roles
 *   post:
 *     summary: Crea un nuevo rol
 *     tags:
 *       - Roles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rol creado
 *       409:
 *         description: El nombre de rol ya existe
 */
router.get('/', getAllRolesHandler);
router.post('/', authGuard, createRoleHandler);

/**
 * @openapi
 * /api/roles/{id}:
 *   get:
 *     summary: Obtiene un rol por Id
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rol encontrado
 *       404:
 *         description: Rol no encontrado
 *   put:
 *     summary: Actualiza un rol
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rol actualizado
 *       404:
 *         description: Rol no encontrado
 *   delete:
 *     summary: Elimina un rol
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Rol eliminado
 *       404:
 *         description: Rol no encontrado
 */
router.get('/:id', getRoleByIdHandler);
router.put('/:id', authGuard, updateRoleHandler);
router.delete('/:id', authGuard, deleteRoleHandler);

export default router;
