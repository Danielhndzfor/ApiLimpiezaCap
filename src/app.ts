import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { apiReference } from '@scalar/express-api-reference';
import { openapiSpec } from './docs/swagger';
import { docsAuth, docsLogout } from './middlewares/docsAuth';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import rolesRoutes from './modules/roles/roles.routes';

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Verifica el estado del servicio
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: El servicio está operativo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/logout', docsLogout);

app.get('/openapi.json', docsAuth, (_req, res) => {
  res.json(openapiSpec);
});

app.use('/api/auth', authRoutes);
app.use('/api/roles', rolesRoutes);

app.use(
  '/',
  docsAuth,
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'script-src': ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
        'style-src': ["'self'", "'unsafe-inline'", 'fonts.googleapis.com', 'cdn.jsdelivr.net'],
        'font-src': ["'self'", 'data:', 'fonts.scalar.com', 'cdn.jsdelivr.net'],
        'img-src': ["'self'", 'data:'],
        'connect-src': ["'self'", 'api.scalar.com'],
      },
    },
  }),
  apiReference({
    url: '/openapi.json',
    favicon: '/logo.jpg',
  })
);

app.use(errorHandler);

export default app;