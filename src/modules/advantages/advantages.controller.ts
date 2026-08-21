import { NextFunction, Response } from 'express';
import { AppError } from '../../utils/AppError';
import { AuthenticatedRequest } from '../../middlewares/authGuard';
import * as advantagesRepository from './advantages.repository';

function handleStatus(status: number): void {
  if (status === 2) throw new AppError('No encontrado', 404);
  if (status === 1) throw new AppError('Operación inválida', 400);
}

function parseText(body: Record<string, unknown>): string {
  const { text } = body ?? {};
  if (!text) throw new AppError('text es obligatorio', 400);
  return String(text);
}

export async function createAdvantageHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { status } = await advantagesRepository.createAdvantage(parseText(req.body), req.user!.idUser);
    handleStatus(status);
    res.status(201).json({ message: 'Creado correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function updateAdvantageHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { status } = await advantagesRepository.updateAdvantage(id, parseText(req.body), req.user!.idUser);
    handleStatus(status);
    res.status(200).json({ message: 'Actualizado correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function deleteAdvantageHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { status } = await advantagesRepository.deleteAdvantage(id);
    handleStatus(status);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getAllAdvantagesHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { rows } = await advantagesRepository.getAllAdvantages();
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
}
