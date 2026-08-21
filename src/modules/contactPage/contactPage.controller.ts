import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import { AuthenticatedRequest } from '../../middlewares/authGuard';
import * as contactPageRepository from './contactPage.repository';
import { ContactPageInput } from './contactPage.repository';

function handleStatus(status: number): void {
  if (status === 2) throw new AppError('No hay contenido configurado', 404);
  if (status === 1) throw new AppError('Operación inválida', 400);
}

function parseInput(body: Record<string, unknown>): ContactPageInput {
  const {
    heroEyebrow,
    heroTitle,
    heroLead,
    officeEyebrow,
    officeTitle,
    officePhoto1Url,
    officePhoto2Url,
    officePhoto3Url,
  } = body ?? {};

  if (!heroEyebrow || !heroTitle || !heroLead || !officeEyebrow || !officeTitle) {
    throw new AppError('Todos los campos son obligatorios', 400);
  }

  return {
    heroEyebrow: String(heroEyebrow),
    heroTitle: String(heroTitle),
    heroLead: String(heroLead),
    officeEyebrow: String(officeEyebrow),
    officeTitle: String(officeTitle),
    officePhoto1Url: officePhoto1Url ? String(officePhoto1Url) : null,
    officePhoto2Url: officePhoto2Url ? String(officePhoto2Url) : null,
    officePhoto3Url: officePhoto3Url ? String(officePhoto3Url) : null,
  };
}

export async function getContactPageHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await contactPageRepository.getContactPage();
    res.status(200).json(rows[0] ?? null);
  } catch (error) {
    next(error);
  }
}

export async function updateContactPageHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const input = parseInput(req.body);
    const { status } = await contactPageRepository.updateContactPage(input, req.user!.idUser);
    handleStatus(status);
    res.status(200).json({ message: 'Actualizado correctamente' });
  } catch (error) {
    next(error);
  }
}
