import app from './app';
import { env } from './config/env';
import { testConnection } from './config/db';
import { colors, printBanner } from './utils/consoleColors';

process.on('unhandledRejection', (reason) => {
  console.error(`${colors.bold}${colors.red}✗ Promesa no manejada:${colors.reset}`, reason);
});

process.on('uncaughtException', (error) => {
  console.error(`${colors.bold}${colors.red}✗ Excepción no capturada:${colors.reset}`, error);
  process.exit(1);
});

app.listen(env.port, async () => {
  printBanner(
    [`Servidor corriendo en http://localhost:${env.port}`, `Entorno: ${env.nodeEnv}`],
    colors.cyan
  );

  try {
    await testConnection();
  } catch (error) {
    console.error(
      `${colors.bold}${colors.red}✗ No se pudo conectar a MariaDB:${colors.reset}`,
      error
    );
  }
});