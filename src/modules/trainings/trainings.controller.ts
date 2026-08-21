import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import { AuthenticatedRequest } from '../../middlewares/authGuard';
import * as trainingsRepository from './trainings.repository';

function handleStatus(status: number): void {
  if (status === 2) throw new AppError('No encontrado', 404);
  if (status === 1) throw new AppError('Operación inválida', 400);
}

function parseText(body: Record<string, unknown>): string {
  const { text } = body ?? {};
  if (!text) throw new AppError('text es obligatorio', 400);
  return String(text);
}

export async function createTrainingHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { status } = await trainingsRepository.createTraining(parseText(req.body), req.user!.idUser);
    handleStatus(status);
    res.status(201).json({ message: 'Creado correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function updateTrainingHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { status } = await trainingsRepository.updateTraining(id, parseText(req.body), req.user!.idUser);
    handleStatus(status);
    res.status(200).json({ message: 'Actualizado correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function deleteTrainingHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { status } = await trainingsRepository.deleteTraining(id);
    handleStatus(status);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getAllTrainingsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await trainingsRepository.getAllTrainings();
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
}
