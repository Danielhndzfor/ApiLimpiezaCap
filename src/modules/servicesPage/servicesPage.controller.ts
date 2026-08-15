import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import * as servicesPageRepository from './servicesPage.repository';
import { ServicesPageInput } from './servicesPage.repository';

function handleStatus(status: number): void {
  if (status === 2) throw new AppError('No hay contenido configurado', 404);
  if (status === 1) throw new AppError('Operación inválida', 400);
}

function parseInput(body: Record<string, unknown>): ServicesPageInput {
  const { heroEyebrow, heroTitle, heroLead, processTitle } = body ?? {};

  if (!heroEyebrow || !heroTitle || !heroLead || !processTitle) {
    throw new AppError('Todos los campos son obligatorios', 400);
  }

  return {
    heroEyebrow: String(heroEyebrow),
    heroTitle: String(heroTitle),
    heroLead: String(heroLead),
    processTitle: String(processTitle),
  };
}

export async function getServicesPageHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await servicesPageRepository.getServicesPage();
    res.status(200).json(rows[0] ?? null);
  } catch (error) {
    next(error);
  }
}

export async function updateServicesPageHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = parseInput(req.body);
    const { status } = await servicesPageRepository.updateServicesPage(input);
    handleStatus(status);
    res.status(200).json({ message: 'Actualizado correctamente' });
  } catch (error) {
    next(error);
  }
}
