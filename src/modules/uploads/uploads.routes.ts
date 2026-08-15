import { Router } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';
import { authGuard } from '../../middlewares/authGuard';
import { AppError } from '../../utils/AppError';

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

// Borra un archivo subido anteriormente cuando se reemplaza o se elimina el
// registro que lo referenciaba. Solo actúa sobre rutas locales (/uploads/...);
// ignora URLs externas o vacías, y no lanza si el archivo ya no existe.
export function deleteUploadedFile(url: string | null | undefined): void {
  if (!url) return;
  const match = url.match(/\/uploads\/([^/?#]+)$/);
  if (!match) return;
  const filePath = path.join(uploadsDir, match[1]);
  fs.unlink(filePath, () => {
    // Ignorar si el archivo no existe o no se pudo borrar.
  });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new AppError('Solo se permiten archivos de imagen', 400));
      return;
    }
    cb(null, true);
  },
});

const router = Router();

/**
 * @openapi
 * /api/uploads:
 *   post:
 *     summary: Sube una imagen y devuelve su URL pública
 *     tags:
 *       - Uploads
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagen subida correctamente
 */
router.post('/', authGuard, upload.single('file'), (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('El archivo es obligatorio', 400);
    }
    res.status(200).json({ url: `/uploads/${req.file.filename}` });
  } catch (error) {
    next(error);
  }
});

export default router;
