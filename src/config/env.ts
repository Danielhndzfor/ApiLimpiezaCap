import dotenv from 'dotenv';

dotenv.config();

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Falta la variable de entorno: ${key}`);
  }
  return value;
}

export const env = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  docsUser: required('DOCS_USER'),
  docsPassword: required('DOCS_PASSWORD'),
  // Ejemplo, agrégalas conforme las necesites:
  // dbConnectionString: required('DB_CONNECTION_STRING'),
  // jwtSecret: required('JWT_SECRET'),
};