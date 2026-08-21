import { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';
import { safeEqual } from '../utils/safeEqual';

const REALM = 'Documentacion API';

function challenge(res: Response): void {
  res.set('WWW-Authenticate', `Basic realm="${REALM}"`);
  res.status(401).send('Autenticación requerida');
}

export function docsAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Basic ')) {
    challenge(res);
    return;
  }

  const decoded = Buffer.from(header.slice('Basic '.length), 'base64').toString('utf8');
  const separatorIndex = decoded.indexOf(':');
  const user = separatorIndex === -1 ? decoded : decoded.slice(0, separatorIndex);
  const password = separatorIndex === -1 ? '' : decoded.slice(separatorIndex + 1);

  if (safeEqual(user, env.docsUser) && safeEqual(password, env.docsPassword)) {
    next();
    return;
  }

  challenge(res);
}

export function docsLogout(_req: Request, res: Response): void {
  challenge(res);
}
