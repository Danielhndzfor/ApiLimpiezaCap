import swaggerJSDoc from 'swagger-jsdoc';
import { env } from '../config/env';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Limpieza CAP',
      version: '1.0.0',
      description: `
API REST del sistema de gestión de Limpieza CAP.

Provee autenticación de usuarios, control de acceso por roles y la
capa de datos sobre una base de datos **MariaDB**.

## Autenticación

La API usa **JWT** con un esquema de access token + refresh token:

1. **\`POST /auth/register\`** — crea un usuario nuevo (\`userName\` + \`password\`).
2. **\`POST /auth/login\`** — valida credenciales y devuelve \`accessToken\` (corta duración) y \`refreshToken\` (larga duración).
3. Envía el \`accessToken\` en cada petición protegida con el header:
   \`Authorization: Bearer {accessToken}\`
4. Cuando el \`accessToken\` expira, usa **\`POST /auth/refresh\`** con el \`refreshToken\` para obtener un par nuevo.
5. **\`POST /auth/logout\`** revoca el \`refreshToken\` (cierra la sesión).

Por seguridad, tras **5 intentos fallidos** de login la cuenta se bloquea automáticamente durante 15 minutos.

## Roles

Los roles (\`admin\`, \`editor\`, \`cliente\`) se administran desde **\`/roles\`** y determinan
los permisos de cada usuario dentro del sistema.

## Convenciones

- Todas las peticiones y respuestas son en formato \`application/json\`.
- Los errores devuelven \`{ "message": string }\` junto con el código HTTP correspondiente
  (400 validación, 401 no autenticado, 403 prohibido, 404 no encontrado, 409 conflicto, 423 cuenta bloqueada).
- Usa **\`GET /health\`** para verificar que el servicio esté operativo.
      `.trim(),
      contact: {
        name: 'Soporte API Limpieza CAP',
        email: 'danielhernandezfor@gmail.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.port}`,
        description: env.nodeEnv,
      },
    ],
    tags: [
      { name: 'Health', description: 'Estado del servicio' },
      { name: 'Auth', description: 'Registro, login, refresh y logout de usuarios' },
      { name: 'Roles', description: 'Administración de roles del sistema' },
      { name: 'Services', description: 'Servicios ofrecidos, mostrados en el sitio público' },
      { name: 'WorkItems', description: 'Trabajos recientes mostrados en el sitio público' },
      { name: 'Testimonials', description: 'Testimonios de clientes mostrados en el sitio público' },
      { name: 'Uploads', description: 'Subida de imágenes' },
      { name: 'CompanyContent', description: 'Secciones de contenido institucional del sitio público' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/**/*.ts', './src/modules/**/*.ts', './src/app.ts'],
};

export const openapiSpec = swaggerJSDoc(options);
