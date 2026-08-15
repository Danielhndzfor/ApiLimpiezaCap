import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import * as equipmentRepository from './equipment.repository';

function handleStatus(status: number): void {
  if (status === 2) throw new AppError('No encontrado', 404);
  if (status === 1) throw new AppError('Operación inválida', 400);
}

function parseText(body: Record<string, unknown>): string {
  const { text } = body ?? {};
  if (!text) throw new AppError('text es obligatorio', 400);
  return String(text);
}

export async function createEquipmentHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = await equipmentRepository.createEquipment(parseText(req.body));
    handleStatus(status);
    res.status(201).json({ message: 'Creado correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function updateEquipmentHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { status } = await equipmentRepository.updateEquipment(id, parseText(req.body));
    handleStatus(status);
    res.status(200).json({ message: 'Actualizado correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function deleteEquipmentHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { status } = await equipmentRepository.deleteEquipment(id);
    handleStatus(status);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getAllEquipmentHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await equipmentRepository.getAllEquipment();
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
}
