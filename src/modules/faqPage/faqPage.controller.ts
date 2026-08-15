import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import * as faqPageRepository from './faqPage.repository';
import { FaqPageInput } from './faqPage.repository';

function handleStatus(status: number): void {
  if (status === 2) throw new AppError('No hay contenido configurado', 404);
  if (status === 1) throw new AppError('Operación inválida', 400);
}

function parseInput(body: Record<string, unknown>): FaqPageInput {
  const { heroEyebrow, heroTitle, bannerText, bannerButtonLabel } = body ?? {};

  if (!heroEyebrow || !heroTitle || !bannerText || !bannerButtonLabel) {
    throw new AppError('Todos los campos son obligatorios', 400);
  }

  return {
    heroEyebrow: String(heroEyebrow),
    heroTitle: String(heroTitle),
    bannerText: String(bannerText),
    bannerButtonLabel: String(bannerButtonLabel),
  };
}

export async function getFaqPageHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await faqPageRepository.getFaqPage();
    res.status(200).json(rows[0] ?? null);
  } catch (error) {
    next(error);
  }
}

export async function updateFaqPageHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = parseInput(req.body);
    const { status } = await faqPageRepository.updateFaqPage(input);
    handleStatus(status);
    res.status(200).json({ message: 'Actualizado correctamente' });
  } catch (error) {
    next(error);
  }
}
