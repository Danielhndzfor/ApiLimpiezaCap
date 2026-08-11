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
  db: {
    host: required('DB_HOST'),
    port: Number(process.env.DB_PORT) || 3306,
    user: required('DB_USER'),
    password: required('DB_PASSWORD'),
    name: required('DB_NAME'),
  },
  jwt: {
    secret: required('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: required('JWT_REFRESH_SECRET'),
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
};