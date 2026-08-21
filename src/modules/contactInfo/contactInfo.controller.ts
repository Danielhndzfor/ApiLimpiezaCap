import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import { AuthenticatedRequest } from '../../middlewares/authGuard';
import * as contactInfoRepository from './contactInfo.repository';
import { ContactInfoInput } from './contactInfo.repository';

function handleStatus(status: number): void {
  if (status === 2) throw new AppError('No hay contenido configurado', 404);
  if (status === 1) throw new AppError('Operación inválida', 400);
}

function parseInput(body: Record<string, unknown>): ContactInfoInput {
  const { phoneDisplay, phoneHref, whatsappNumber, email, address, hours, tagline } = body ?? {};

  if (!phoneDisplay || !phoneHref || !whatsappNumber || !email || !address || !hours || !tagline) {
    throw new AppError('Todos los campos de contacto son obligatorios', 400);
  }

  return {
    phoneDisplay: String(phoneDisplay),
    phoneHref: String(phoneHref),
    whatsappNumber: String(whatsappNumber),
    email: String(email),
    address: String(address),
    hours: String(hours),
    tagline: String(tagline),
  };
}

export async function getContactInfoHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await contactInfoRepository.getContactInfo();
    res.status(200).json(rows[0] ?? null);
  } catch (error) {
    next(error);
  }
}

export async function updateContactInfoHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const input = parseInput(req.body);
    const { status } = await contactInfoRepository.updateContactInfo(input, req.user!.idUser);
    handleStatus(status);
    res.status(200).json({ message: 'Actualizado correctamente' });
  } catch (error) {
    next(error);
  }
}
