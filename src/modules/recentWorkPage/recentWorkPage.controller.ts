import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import * as recentWorkPageRepository from './recentWorkPage.repository';
import { RecentWorkPageInput } from './recentWorkPage.repository';

function handleStatus(status: number): void {
  if (status === 2) throw new AppError('No hay contenido configurado', 404);
  if (status === 1) throw new AppError('Operación inválida', 400);
}

function parseInput(body: Record<string, unknown>): RecentWorkPageInput {
  const { heroEyebrow, heroTitle, heroLead } = body ?? {};

  if (!heroEyebrow || !heroTitle || !heroLead) {
    throw new AppError('Todos los campos son obligatorios', 400);
  }

  return {
    heroEyebrow: String(heroEyebrow),
    heroTitle: String(heroTitle),
    heroLead: String(heroLead),
  };
}

export async function getRecentWorkPageHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await recentWorkPageRepository.getRecentWorkPage();
    res.status(200).json(rows[0] ?? null);
  } catch (error) {
    next(error);
  }
}

export async function updateRecentWorkPageHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = parseInput(req.body);
    const { status } = await recentWorkPageRepository.updateRecentWorkPage(input);
    handleStatus(status);
    res.status(200).json({ message: 'Actualizado correctamente' });
  } catch (error) {
    next(error);
  }
}
