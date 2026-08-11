import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import * as authService from './auth.service';

export async function registerHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { userName, password, idRole } = req.body ?? {};

    if (!userName || !password) {
      throw new AppError('userName y password son obligatorios', 400);
    }

    const { idUser, user } = await authService.register({ userName, password, idRole });

    res.status(201).json({ idUser, user });
  } catch (error) {
    next(error);
  }
}

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { userName, password } = req.body ?? {};

    if (!userName || !password) {
      throw new AppError('userName y password son obligatorios', 400);
    }

    const { user, tokens } = await authService.login({ userName, password });

    res.status(200).json({ user, ...tokens });
  } catch (error) {
    next(error);
  }
}

export async function refreshHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body ?? {};

    if (!refreshToken) {
      throw new AppError('refreshToken es obligatorio', 400);
    }

    const tokens = await authService.refresh(refreshToken);

    res.status(200).json(tokens);
  } catch (error) {
    next(error);
  }
}

export async function logoutHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body ?? {};

    if (!refreshToken) {
      throw new AppError('refreshToken es obligatorio', 400);
    }

    await authService.logout(refreshToken);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
