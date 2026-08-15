import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import * as testimonialsRepository from './testimonials.repository';
import { TestimonialInput } from './testimonials.repository';

function handleStatus(status: number): void {
  if (status === 2) {
    throw new AppError('Testimonio no encontrado', 404);
  }
  if (status === 1) {
    throw new AppError('Operación inválida', 400);
  }
}

function parseInput(body: Record<string, unknown>): TestimonialInput {
  const { quote, name, source } = body ?? {};

  if (!quote || !name || !source) {
    throw new AppError('quote, name y source son obligatorios', 400);
  }

  return { quote: String(quote), name: String(name), source: String(source) };
}

export async function createTestimonialHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = parseInput(req.body);
    const { status } = await testimonialsRepository.createTestimonial(input);
    handleStatus(status);
    res.status(201).json({ message: 'Testimonio creado correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function updateTestimonialHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const idTestimonial = Number(req.params.id);
    const input = parseInput(req.body);
    const { status } = await testimonialsRepository.updateTestimonial(idTestimonial, input);
    handleStatus(status);
    res.status(200).json({ message: 'Testimonio actualizado correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function deleteTestimonialHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const idTestimonial = Number(req.params.id);
    const { status } = await testimonialsRepository.deleteTestimonial(idTestimonial);
    handleStatus(status);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getAllTestimonialsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await testimonialsRepository.getAllTestimonials();
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
}
