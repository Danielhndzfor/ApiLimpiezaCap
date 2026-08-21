import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import { AuthenticatedRequest } from '../../middlewares/authGuard';
import * as marqueeItemsRepository from './marqueeItems.repository';

function handleStatus(status: number): void {
  if (status === 2) throw new AppError('No encontrado', 404);
  if (status === 1) throw new AppError('Operación inválida', 400);
}

function handleMoveStatus(status: number): void {
  if (status === 2) throw new AppError('No se puede mover: ya está en el extremo', 400);
  if (status === 1) throw new AppError('Operación inválida', 400);
}

function parseText(body: Record<string, unknown>): string {
  const { text } = body ?? {};
  if (!text) throw new AppError('text es obligatorio', 400);
  return String(text);
}

export async function createMarqueeItemHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { status } = await marqueeItemsRepository.createMarqueeItem(parseText(req.body), req.user!.idUser);
    handleStatus(status);
    res.status(201).json({ message: 'Creado correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function updateMarqueeItemHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { status } = await marqueeItemsRepository.updateMarqueeItem(id, parseText(req.body), req.user!.idUser);
    handleStatus(status);
    res.status(200).json({ message: 'Actualizado correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function deleteMarqueeItemHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { status } = await marqueeItemsRepository.deleteMarqueeItem(id);
    handleStatus(status);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getAllMarqueeItemsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await marqueeItemsRepository.getAllMarqueeItems();
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
}

export async function moveMarqueeItemUpHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { status } = await marqueeItemsRepository.moveMarqueeItemUp(id, req.user!.idUser);
    handleMoveStatus(status);
    res.status(200).json({ message: 'Movido correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function moveMarqueeItemDownHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { status } = await marqueeItemsRepository.moveMarqueeItemDown(id, req.user!.idUser);
    handleMoveStatus(status);
    res.status(200).json({ message: 'Movido correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function reorderMarqueeItemsHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { ids } = req.body ?? {};
    if (!Array.isArray(ids) || ids.some((id) => typeof id !== 'number')) {
      throw new AppError('ids debe ser un arreglo de números', 400);
    }
    await marqueeItemsRepository.reorderMarqueeItems(ids, req.user!.idUser);
    res.status(200).json({ message: 'Orden actualizado correctamente' });
  } catch (error) {
    next(error);
  }
}
