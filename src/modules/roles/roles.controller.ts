import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import * as rolesRepository from './roles.repository';

function handleStatus(status: number): void {
  if (status === 2) {
    throw new AppError('Rol no encontrado', 404);
  }
  if (status === 3) {
    throw new AppError('El nombre de rol ya existe', 409);
  }
  if (status === 1) {
    throw new AppError('Operación inválida', 400);
  }
}

export async function createRoleHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, description } = req.body ?? {};
    if (!name) {
      throw new AppError('name es obligatorio', 400);
    }

    const { status } = await rolesRepository.createRole(name, description ?? null);
    handleStatus(status);

    res.status(201).json({ message: 'Rol creado correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function updateRoleHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const idRole = Number(req.params.id);
    const { name, description } = req.body ?? {};
    if (!name) {
      throw new AppError('name es obligatorio', 400);
    }

    const { status } = await rolesRepository.updateRole(idRole, name, description ?? null);
    handleStatus(status);

    res.status(200).json({ message: 'Rol actualizado correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function deleteRoleHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const idRole = Number(req.params.id);

    const { status } = await rolesRepository.deleteRole(idRole);
    handleStatus(status);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getAllRolesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await rolesRepository.getAllRoles();
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
}

export async function getRoleByIdHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const idRole = Number(req.params.id);

    const { status, rows } = await rolesRepository.getRoleById(idRole);
    handleStatus(status);

    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
}
