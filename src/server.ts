import app from './app';
import { env } from './config/env';
import { testConnection } from './config/db';
import { colors, printBanner } from './utils/consoleColors';

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