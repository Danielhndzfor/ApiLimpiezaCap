import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import * as homeHeroRepository from './homeHero.repository';
import { HomeHeroInput } from './homeHero.repository';

function handleStatus(status: number): void {
  if (status === 2) throw new AppError('No hay contenido configurado', 404);
  if (status === 1) throw new AppError('Operación inválida', 400);
}

function parseInput(body: Record<string, unknown>): HomeHeroInput {
  const {
    eyebrow,
    titleMain,
    titleHighlight,
    lead,
    statReviews,
    statResponse,
    statGuarantee,
    badgeClients,
    badgeTagline,
    ctaTitle,
    ctaText,
    photoUrl,
    ctaPrimaryLabel,
    ctaSecondaryLabel,
  } = body ?? {};

  if (
    !eyebrow ||
    !titleMain ||
    !titleHighlight ||
    !lead ||
    !statReviews ||
    !statResponse ||
    !statGuarantee ||
    !badgeClients ||
    !badgeTagline ||
    !ctaTitle ||
    !ctaText ||
    !ctaPrimaryLabel ||
    !ctaSecondaryLabel
  ) {
    throw new AppError('Todos los campos del hero de Inicio son obligatorios', 400);
  }

  return {
    eyebrow: String(eyebrow),
    titleMain: String(titleMain),
    titleHighlight: String(titleHighlight),
    lead: String(lead),
    statReviews: String(statReviews),
    statResponse: String(statResponse),
    statGuarantee: String(statGuarantee),
    badgeClients: String(badgeClients),
    badgeTagline: String(badgeTagline),
    ctaTitle: String(ctaTitle),
    ctaText: String(ctaText),
    photoUrl: photoUrl ? String(photoUrl) : null,
    ctaPrimaryLabel: String(ctaPrimaryLabel),
    ctaSecondaryLabel: String(ctaSecondaryLabel),
  };
}

export async function getHomeHeroHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await homeHeroRepository.getHomeHero();
    res.status(200).json(rows[0] ?? null);
  } catch (error) {
    next(error);
  }
}

export async function updateHomeHeroHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = parseInput(req.body);
    const { status } = await homeHeroRepository.updateHomeHero(input);
    handleStatus(status);
    res.status(200).json({ message: 'Actualizado correctamente' });
  } catch (error) {
    next(error);
  }
}
