import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import * as milestonesRepository from './milestones.repository';
import { MilestoneInput } from './milestones.repository';

function handleStatus(status: number): void {
  if (status === 2) throw new AppError('No encontrado', 404);
  if (status === 1) throw new AppError('Operación inválida', 400);
}

function parseInput(body: Record<string, unknown>): MilestoneInput {
  const { yearLabel, title, description } = body ?? {};
  if (!yearLabel || !title || !description) {
    throw new AppError('yearLabel, title y description son obligatorios', 400);
  }
  return { yearLabel: String(yearLabel), title: String(title), description: String(description) };
}

export async function createMilestoneHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = await milestonesRepository.createMilestone(parseInput(req.body));
    handleStatus(status);
    res.status(201).json({ message: 'Creado correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function updateMilestoneHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { status } = await milestonesRepository.updateMilestone(id, parseInput(req.body));
    handleStatus(status);
    res.status(200).json({ message: 'Actualizado correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function deleteMilestoneHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { status } = await milestonesRepository.deleteMilestone(id);
    handleStatus(status);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getAllMilestonesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await milestonesRepository.getAllMilestones();
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
}
