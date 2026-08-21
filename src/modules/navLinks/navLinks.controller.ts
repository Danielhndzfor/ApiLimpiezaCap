import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import { AuthenticatedRequest } from '../../middlewares/authGuard';
import * as navLinksRepository from './navLinks.repository';

function handleStatus(status: number): void {
  if (status === 2) throw new AppError('No encontrado', 404);
  if (status === 1) throw new AppError('Operación inválida', 400);
}

export async function getAllNavLinksHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await navLinksRepository.getAllNavLinks();
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
}

export async function updateNavLinkHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { linkKey, label } = req.body ?? {};
    if (!linkKey || !label) throw new AppError('linkKey y label son obligatorios', 400);
    const { status } = await navLinksRepository.updateNavLink(String(linkKey), String(label), req.user!.idUser);
    handleStatus(status);
    res.status(200).json({ message: 'Actualizado correctamente' });
  } catch (error) {
    next(error);
  }
}
