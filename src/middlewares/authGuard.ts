import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

export interface AuthenticatedRequest extends Request {
  user?: { idUser: number; role: string };
}

export function authGuard(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError('No autorizado', 401);
  }

  const token = header.slice('Bearer '.length);

  let payload: { sub: number; role: string };
  try {
    payload = jwt.verify(token, env.jwt.secret) as unknown as { sub: number; role: string };
  } catch {
    throw new AppError('Token inválido o expirado', 401);
  }

  if (payload.role !== 'admin') {
    throw new AppError('No tienes permisos de administrador', 403);
  }

  req.user = { idUser: payload.sub, role: payload.role };
  next();
}
