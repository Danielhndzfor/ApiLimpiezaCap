import { Router } from 'express';
import { loginRateLimiter, registerRateLimiter } from '../../middlewares/authRateLimit';
import {
  loginHandler,
  logoutHandler,
  refreshHandler,
  registerHandler,
} from './auth.controller';

const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userName, password]
 *             properties:
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *               idRole:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Usuario creado
 *       409:
 *         description: El nombre de usuario ya está registrado
 */
router.post('/register', registerRateLimiter, registerHandler);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión y devuelve access token + refresh token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userName, password]
 *             properties:
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 *       423:
 *         description: Cuenta bloqueada temporalmente
 */
router.post('/login', loginRateLimiter, loginHandler);

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     summary: Genera un nuevo access token a partir de un refresh token válido
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nuevo par de tokens
 *       401:
 *         description: Refresh token inválido, expirado o revocado
 */
router.post('/refresh', loginRateLimiter, refreshHandler);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Revoca un refresh token (cierra sesión)
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       204:
 *         description: Sesión cerrada
 */
router.post('/logout', logoutHandler);

export default router;
