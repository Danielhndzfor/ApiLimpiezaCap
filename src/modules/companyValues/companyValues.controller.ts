import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import { AuthenticatedRequest } from '../../middlewares/authGuard';
import * as companyValuesRepository from './companyValues.repository';
import { CompanyValueInput } from './companyValues.repository';

function handleStatus(status: number): void {
  if (status === 2) throw new AppError('No encontrado', 404);
  if (status === 1) throw new AppError('Operación inválida', 400);
}

function parseInput(body: Record<string, unknown>): CompanyValueInput {
  const { icon, title } = body ?? {};
  if (!icon || !title) throw new AppError('icon y title son obligatorios', 400);
  return { icon: String(icon), title: String(title) };
}

export async function createCompanyValueHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { status } = await companyValuesRepository.createCompanyValue(parseInput(req.body), req.user!.idUser);
    handleStatus(status);
    res.status(201).json({ message: 'Creado correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function updateCompanyValueHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { status } = await companyValuesRepository.updateCompanyValue(id, parseInput(req.body), req.user!.idUser);
    handleStatus(status);
    res.status(200).json({ message: 'Actualizado correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function deleteCompanyValueHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { status } = await companyValuesRepository.deleteCompanyValue(id);
    handleStatus(status);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getAllCompanyValuesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await companyValuesRepository.getAllCompanyValues();
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
}
