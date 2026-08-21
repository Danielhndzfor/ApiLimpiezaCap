import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import { AuthenticatedRequest } from '../../middlewares/authGuard';
import * as jobsRepository from './jobs.repository';
import { JobInput } from './jobs.repository';

function handleStatus(status: number): void {
  if (status === 2) throw new AppError('Vacante no encontrada', 404);
  if (status === 3) throw new AppError('El slug ya existe', 409);
  if (status === 1) throw new AppError('Operación inválida', 400);
}

function parseInput(body: Record<string, unknown>): JobInput {
  const { slug, title, type, description, requirements } = body ?? {};

  if (!slug || !title || !type || !description || !Array.isArray(requirements)) {
    throw new AppError('slug, title, type, description y requirements (array) son obligatorios', 400);
  }

  return {
    slug: String(slug),
    title: String(title),
    type: String(type),
    description: String(description),
    requirements: requirements.map(String),
  };
}

export async function createJobHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const input = parseInput(req.body);
    const { status } = await jobsRepository.createJob(input, req.user!.idUser);
    handleStatus(status);
    res.status(201).json({ message: 'Vacante creada correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function updateJobHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const idJob = Number(req.params.id);
    const input = parseInput(req.body);
    const { status } = await jobsRepository.updateJob(idJob, input, req.user!.idUser);
    handleStatus(status);
    res.status(200).json({ message: 'Vacante actualizada correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function deleteJobHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const idJob = Number(req.params.id);
    const { status } = await jobsRepository.deleteJob(idJob);
    handleStatus(status);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getAllJobsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await jobsRepository.getAllJobs();
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
}

export async function getJobBySlugHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, rows } = await jobsRepository.getJobBySlug(String(req.params.slug));
    handleStatus(status);
    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
}
