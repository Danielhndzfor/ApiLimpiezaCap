import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import * as servicesRepository from './services.repository';
import { ServiceInput } from './services.repository';

function handleStatus(status: number): void {
  if (status === 2) {
    throw new AppError('Servicio no encontrado', 404);
  }
  if (status === 3) {
    throw new AppError('El slug ya existe', 409);
  }
  if (status === 1) {
    throw new AppError('Operación inválida', 400);
  }
}

function parseInput(body: Record<string, unknown>): ServiceInput {
  const { slug, num, icon, tag, title, shortDescription, longDescription, includes, idealFor } =
    body ?? {};

  if (
    !slug ||
    !num ||
    !icon ||
    !tag ||
    !title ||
    !shortDescription ||
    !longDescription ||
    !idealFor ||
    !Array.isArray(includes)
  ) {
    throw new AppError(
      'slug, num, icon, tag, title, shortDescription, longDescription, includes (array) e idealFor son obligatorios',
      400
    );
  }

  return {
    slug: String(slug),
    num: String(num),
    icon: String(icon),
    tag: String(tag),
    title: String(title),
    shortDescription: String(shortDescription),
    longDescription: String(longDescription),
    includes: includes.map(String),
    idealFor: String(idealFor),
  };
}

export async function createServiceHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = parseInput(req.body);
    const { status } = await servicesRepository.createService(input);
    handleStatus(status);
    res.status(201).json({ message: 'Servicio creado correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function updateServiceHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const idService = Number(req.params.id);
    const input = parseInput(req.body);
    const { status } = await servicesRepository.updateService(idService, input);
    handleStatus(status);
    res.status(200).json({ message: 'Servicio actualizado correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function deleteServiceHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const idService = Number(req.params.id);
    const { status } = await servicesRepository.deleteService(idService);
    handleStatus(status);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getAllServicesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await servicesRepository.getAllServices();
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
}

export async function getServiceBySlugHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, rows } = await servicesRepository.getServiceBySlug(String(req.params.slug));
    handleStatus(status);
    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
}
