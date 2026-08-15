import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import * as aboutHeroRepository from './aboutHero.repository';
import { AboutHeroInput } from './aboutHero.repository';

function handleStatus(status: number): void {
  if (status === 2) throw new AppError('No hay contenido configurado', 404);
  if (status === 1) throw new AppError('Operación inválida', 400);
}

function parseInput(body: Record<string, unknown>): AboutHeroInput {
  const {
    eyebrow,
    title,
    titleHighlight,
    lead,
    badgeText,
    photoUrl,
    valuesEyebrow,
    valuesTitle,
    operationEyebrow,
    operationTitle,
    jobsEyebrow,
    jobsTitle,
    jobsLead,
  } = body ?? {};

  if (
    !eyebrow ||
    !title ||
    !titleHighlight ||
    !lead ||
    !badgeText ||
    !valuesEyebrow ||
    !valuesTitle ||
    !operationEyebrow ||
    !operationTitle ||
    !jobsEyebrow ||
    !jobsTitle ||
    !jobsLead
  ) {
    throw new AppError('Todos los campos del hero de Nosotros son obligatorios', 400);
  }

  return {
    eyebrow: String(eyebrow),
    title: String(title),
    titleHighlight: String(titleHighlight),
    lead: String(lead),
    badgeText: String(badgeText),
    photoUrl: photoUrl ? String(photoUrl) : null,
    valuesEyebrow: String(valuesEyebrow),
    valuesTitle: String(valuesTitle),
    operationEyebrow: String(operationEyebrow),
    operationTitle: String(operationTitle),
    jobsEyebrow: String(jobsEyebrow),
    jobsTitle: String(jobsTitle),
    jobsLead: String(jobsLead),
  };
}

export async function getAboutHeroHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await aboutHeroRepository.getAboutHero();
    res.status(200).json(rows[0] ?? null);
  } catch (error) {
    next(error);
  }
}

export async function updateAboutHeroHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = parseInput(req.body);
    const { status } = await aboutHeroRepository.updateAboutHero(input);
    handleStatus(status);
    res.status(200).json({ message: 'Actualizado correctamente' });
  } catch (error) {
    next(error);
  }
}
