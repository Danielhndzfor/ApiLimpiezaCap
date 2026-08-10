import swaggerJSDoc from 'swagger-jsdoc';
import { env } from '../config/env';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Limpieza CAP',
      version: '1.0.0',
      description: 'Documentación de la API generada con swagger-jsdoc.',
    },
    servers: [
      {
        url: `http://localhost:${env.port}`,
        description: env.nodeEnv,
      },
    ],
  },
  apis: ['./src/routes/**/*.ts', './src/app.ts'],
};

export const openapiSpec = swaggerJSDoc(options);
