import { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

export interface HomeHeroRow extends RowDataPacket {
  IdHomeHero: number;
  Eyebrow: string;
  TitleMain: string;
  TitleHighlight: string;
  Lead: string;
  StatReviews: string;
  StatResponse: string;
  StatGuarantee: string;
  BadgeClients: string;
  BadgeTagline: string;
  CtaTitle: string;
  CtaText: string;
  PhotoUrl: string | null;
  CtaPrimaryLabel: string;
  CtaSecondaryLabel: string;
  UpdatedByUserId: number | null;
  UpdatedAt: string;
}

interface StatusRow extends RowDataPacket {
  status: number;
}

const OPC = { UPDATE: 1, SELECT: 4 } as const;

export interface HomeHeroInput {
  eyebrow: string;
  titleMain: string;
  titleHighlight: string;
  lead: string;
  statReviews: string;
  statResponse: string;
  statGuarantee: string;
  badgeClients: string;
  badgeTagline: string;
  ctaTitle: string;
  ctaText: string;
  photoUrl: string | null;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
}

async function callCrud(
  opc: number,
  input: HomeHeroInput | null,
  idUser: number | null
): Promise<{ status: number; rows: HomeHeroRow[] }> {
  const [result] = await pool.query<RowDataPacket[][]>(
    'CALL sp_HomeHero_CRUD(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @pStatus)',
    [
      opc,
      input?.eyebrow ?? null,
      input?.titleMain ?? null,
      input?.titleHighlight ?? null,
      input?.lead ?? null,
      input?.statReviews ?? null,
      input?.statResponse ?? null,
      input?.statGuarantee ?? null,
      input?.badgeClients ?? null,
      input?.badgeTagline ?? null,
      input?.ctaTitle ?? null,
      input?.ctaText ?? null,
      input?.photoUrl ?? null,
      input?.ctaPrimaryLabel ?? null,
      input?.ctaSecondaryLabel ?? null,
      idUser,
    ]
  );
  const [statusRows] = await pool.query<StatusRow[]>('SELECT @pStatus AS status');

  const hasResultSet = Array.isArray(result) && Array.isArray(result[0]);
  const rows = hasResultSet ? (result[0] as unknown as HomeHeroRow[]) : [];

  return { status: statusRows[0].status, rows };
}

export async function getHomeHero() {
  return callCrud(OPC.SELECT, null, null);
}

export async function updateHomeHero(input: HomeHeroInput, idUser: number) {
  return callCrud(OPC.UPDATE, input, idUser);
}
