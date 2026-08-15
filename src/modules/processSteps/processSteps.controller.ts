import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import * as processStepsRepository from './processSteps.repository';
import { ProcessStepInput } from './processSteps.repository';

function handleStatus(status: number): void {
  if (status === 2) throw new AppError('No encontrado', 404);
  if (status === 1) throw new AppError('Operación inválida', 400);
}

function parseInput(body: Record<string, unknown>): ProcessStepInput {
  const { n, title, description } = body ?? {};
  if (!n || !title || !description) {
    throw new AppError('n, title y description son obligatorios', 400);
  }
  return { n: String(n), title: String(title), description: String(description) };
}

export async function createProcessStepHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = await processStepsRepository.createProcessStep(parseInput(req.body));
    handleStatus(status);
    res.status(201).json({ message: 'Creado correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function updateProcessStepHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { status } = await processStepsRepository.updateProcessStep(id, parseInput(req.body));
    handleStatus(status);
    res.status(200).json({ message: 'Actualizado correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function deleteProcessStepHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { status } = await processStepsRepository.deleteProcessStep(id);
    handleStatus(status);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getAllProcessStepsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await processStepsRepository.getAllProcessSteps();
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
}
