import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import { AuthenticatedRequest } from '../../middlewares/authGuard';
import { deleteUploadedFile } from '../uploads/uploads.routes';
import * as workItemsRepository from './workitems.repository';
import { WorkItemInput } from './workitems.repository';

function handleStatus(status: number): void {
  if (status === 2) {
    throw new AppError('Trabajo no encontrado', 404);
  }
  if (status === 1) {
    throw new AppError('Operación inválida', 400);
  }
}

function parseInput(body: Record<string, unknown>): WorkItemInput {
  const { tag, title, imageUrl } = body ?? {};

  if (!tag || !title) {
    throw new AppError('tag y title son obligatorios', 400);
  }

  return {
    tag: String(tag),
    title: String(title),
    imageUrl: imageUrl ? String(imageUrl) : null,
  };
}

export async function createWorkItemHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const input = parseInput(req.body);
    const { status } = await workItemsRepository.createWorkItem(input, req.user!.idUser);
    handleStatus(status);
    res.status(201).json({ message: 'Trabajo creado correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function updateWorkItemHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const idWorkItem = Number(req.params.id);
    const input = parseInput(req.body);

    const { rows: existingRows } = await workItemsRepository.getWorkItemById(idWorkItem);
    const previousImageUrl = existingRows[0]?.ImageUrl ?? null;

    const { status } = await workItemsRepository.updateWorkItem(idWorkItem, input, req.user!.idUser);
    handleStatus(status);

    if (previousImageUrl && previousImageUrl !== input.imageUrl) {
      deleteUploadedFile(previousImageUrl);
    }

    res.status(200).json({ message: 'Trabajo actualizado correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function deleteWorkItemHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const idWorkItem = Number(req.params.id);

    const { rows: existingRows } = await workItemsRepository.getWorkItemById(idWorkItem);
    const previousImageUrl = existingRows[0]?.ImageUrl ?? null;

    const { status } = await workItemsRepository.deleteWorkItem(idWorkItem);
    handleStatus(status);

    deleteUploadedFile(previousImageUrl);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getAllWorkItemsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await workItemsRepository.getAllWorkItems();
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
}
