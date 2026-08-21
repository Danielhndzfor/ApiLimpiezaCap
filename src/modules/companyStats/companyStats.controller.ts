import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import { AuthenticatedRequest } from '../../middlewares/authGuard';
import * as companyStatsRepository from './companyStats.repository';

function handleStatus(status: number): void {
  if (status === 2) throw new AppError('No hay contenido configurado', 404);
  if (status === 1) throw new AppError('Operación inválida', 400);
}

export async function getCompanyStatsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await companyStatsRepository.getCompanyStats();
    res.status(200).json(rows[0] ?? null);
  } catch (error) {
    next(error);
  }
}

export async function updateCompanyStatsHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { years, clients, squareMetersK } = req.body ?? {};
    if (years === undefined || clients === undefined || squareMetersK === undefined) {
      throw new AppError('years, clients y squareMetersK son obligatorios', 400);
    }
    const { status } = await companyStatsRepository.updateCompanyStats(
      {
        years: Number(years),
        clients: Number(clients),
        squareMetersK: Number(squareMetersK),
      },
      req.user!.idUser
    );
    handleStatus(status);
    res.status(200).json({ message: 'Actualizado correctamente' });
  } catch (error) {
    next(error);
  }
}
