import { Router } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import { randomUUID } from 'crypto';
import { authGuard } from '../../middlewares/authGuard';
import { AppError } from '../../utils/AppError';

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);
const ALLOWED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

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

function slugify(input: string): string {
  const slug = input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return slug || 'imagen';
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(file.mimetype) || !ALLOWED_EXTENSIONS.has(ext)) {
      cb(new AppError('Formato no permitido. Solo se aceptan PNG, JPG, JPEG o WEBP.', 400));
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
 *     summary: Sube una imagen (se convierte a WebP) y devuelve su URL pública
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
router.post('/', authGuard, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('El archivo es obligatorio', 400);
    }

    const baseName = slugify(path.parse(req.file.originalname).name);
    const uniqueSuffix = randomUUID().slice(0, 8);
    const filename = `${baseName}-${uniqueSuffix}.webp`;

    await sharp(req.file.buffer).webp({ quality: 82 }).toFile(path.join(uploadsDir, filename));

    res.status(200).json({ url: `/uploads/${filename}` });
  } catch (error) {
    next(error);
  }
});

export default router;
