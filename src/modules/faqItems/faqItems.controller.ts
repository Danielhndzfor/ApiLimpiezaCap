import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import { AuthenticatedRequest } from '../../middlewares/authGuard';
import * as faqItemsRepository from './faqItems.repository';
import { FaqItemInput } from './faqItems.repository';

function handleStatus(status: number): void {
  if (status === 2) throw new AppError('No encontrado', 404);
  if (status === 1) throw new AppError('Operación inválida', 400);
}

function parseInput(body: Record<string, unknown>): FaqItemInput {
  const { question, answer } = body ?? {};
  if (!question || !answer) throw new AppError('question y answer son obligatorios', 400);
  return { question: String(question), answer: String(answer) };
}

export async function createFaqItemHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { status } = await faqItemsRepository.createFaqItem(parseInput(req.body), req.user!.idUser);
    handleStatus(status);
    res.status(201).json({ message: 'Creado correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function updateFaqItemHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { status } = await faqItemsRepository.updateFaqItem(id, parseInput(req.body), req.user!.idUser);
    handleStatus(status);
    res.status(200).json({ message: 'Actualizado correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function deleteFaqItemHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { status } = await faqItemsRepository.deleteFaqItem(id);
    handleStatus(status);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getAllFaqItemsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await faqItemsRepository.getAllFaqItems();
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
}
