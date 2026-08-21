import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { apiReference } from '@scalar/express-api-reference';
import { openapiSpec } from './docs/swagger';
import { docsAuth, docsLogout } from './middlewares/docsAuth';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import rolesRoutes from './modules/roles/roles.routes';
import servicesRoutes from './modules/services/services.routes';
import workItemsRoutes from './modules/workitems/workitems.routes';
import testimonialsRoutes from './modules/testimonials/testimonials.routes';
import uploadsRoutes from './modules/uploads/uploads.routes';
import advantagesRoutes from './modules/advantages/advantages.routes';
import marqueeItemsRoutes from './modules/marqueeItems/marqueeItems.routes';
import trainingsRoutes from './modules/trainings/trainings.routes';
import equipmentRoutes from './modules/equipment/equipment.routes';
import securityMeasuresRoutes from './modules/securityMeasures/securityMeasures.routes';
import supervisionRoutes from './modules/supervision/supervision.routes';
import coverageRoutes from './modules/coverage/coverage.routes';
import companyProductsRoutes from './modules/companyProducts/companyProducts.routes';
import missionRoutes from './modules/mission/mission.routes';
import visionRoutes from './modules/vision/vision.routes';
import companyValuesRoutes from './modules/companyValues/companyValues.routes';
import milestonesRoutes from './modules/milestones/milestones.routes';
import companyStatsRoutes from './modules/companyStats/companyStats.routes';
import homeHeroRoutes from './modules/homeHero/homeHero.routes';
import aboutHeroRoutes from './modules/aboutHero/aboutHero.routes';
import jobsRoutes from './modules/jobs/jobs.routes';
import navLinksRoutes from './modules/navLinks/navLinks.routes';
import contactInfoRoutes from './modules/contactInfo/contactInfo.routes';
import faqItemsRoutes from './modules/faqItems/faqItems.routes';
import contactPageRoutes from './modules/contactPage/contactPage.routes';
import processStepsRoutes from './modules/processSteps/processSteps.routes';
import servicesPageRoutes from './modules/servicesPage/servicesPage.routes';
import recentWorkPageRoutes from './modules/recentWorkPage/recentWorkPage.routes';
import faqPageRoutes from './modules/faqPage/faqPage.routes';

const app: Application = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
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
app.use('/api/services', servicesRoutes);
app.use('/api/workitems', workItemsRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api/advantages', advantagesRoutes);
app.use('/api/marquee-items', marqueeItemsRoutes);
app.use('/api/trainings', trainingsRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/security-measures', securityMeasuresRoutes);
app.use('/api/supervision', supervisionRoutes);
app.use('/api/coverage', coverageRoutes);
app.use('/api/company-products', companyProductsRoutes);
app.use('/api/mission', missionRoutes);
app.use('/api/vision', visionRoutes);
app.use('/api/values', companyValuesRoutes);
app.use('/api/milestones', milestonesRoutes);
app.use('/api/company-stats', companyStatsRoutes);
app.use('/api/home-hero', homeHeroRoutes);
app.use('/api/about-hero', aboutHeroRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/nav-links', navLinksRoutes);
app.use('/api/contact-info', contactInfoRoutes);
app.use('/api/faq-items', faqItemsRoutes);
app.use('/api/contact-page', contactPageRoutes);
app.use('/api/process-steps', processStepsRoutes);
app.use('/api/services-page', servicesPageRoutes);
app.use('/api/recent-work-page', recentWorkPageRoutes);
app.use('/api/faq-page', faqPageRoutes);

// Cualquier ruta /api/* que no haya coincidido con un módulo registrado arriba
// es un 404 real, no debe caer en el auth de la documentación (que devolvía
// un 401 confuso "Autenticación requerida" para endpoints simplemente inexistentes).
app.use('/api', (_req, res) => {
  res.status(404).json({ message: 'Recurso no encontrado' });
});

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