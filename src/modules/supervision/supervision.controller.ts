import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import { AuthenticatedRequest } from '../../middlewares/authGuard';
import * as supervisionRepository from './supervision.repository';

function handleStatus(status: number): void {
  if (status === 2) throw new AppError('No hay contenido configurado', 404);
  if (status === 1) throw new AppError('Operación inválida', 400);
}

export async function getSupervisionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await supervisionRepository.getSupervision();
    res.status(200).json(rows[0] ?? null);
  } catch (error) {
    next(error);
  }
}

export async function updateSupervisionHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { body } = req.body ?? {};
    if (!body) throw new AppError('body es obligatorio', 400);
    const { status } = await supervisionRepository.updateSupervision(String(body), req.user!.idUser);
    handleStatus(status);
    res.status(200).json({ message: 'Actualizado correctamente' });
  } catch (error) {
    next(error);
  }
}
