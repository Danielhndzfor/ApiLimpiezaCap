import { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

export interface FaqPageRow extends RowDataPacket {
  IdFaqPage: number;
  HeroEyebrow: string;
  HeroTitle: string;
  BannerText: string;
  BannerButtonLabel: string;
  UpdatedByUserId: number | null;
  UpdatedAt: string;
}

interface StatusRow extends RowDataPacket {
  status: number;
}

const OPC = { UPDATE: 1, SELECT: 4 } as const;

export interface FaqPageInput {
  heroEyebrow: string;
  heroTitle: string;
  bannerText: string;
  bannerButtonLabel: string;
}

async function callCrud(
  opc: number,
  input: FaqPageInput | null,
  idUser: number | null
): Promise<{ status: number; rows: FaqPageRow[] }> {
  const [result] = await pool.query<RowDataPacket[][]>(
    'CALL sp_FaqPage_CRUD(?, ?, ?, ?, ?, ?, @pStatus)',
    [opc, input?.heroEyebrow ?? null, input?.heroTitle ?? null, input?.bannerText ?? null, input?.bannerButtonLabel ?? null, idUser]
  );
  const [statusRows] = await pool.query<StatusRow[]>('SELECT @pStatus AS status');

  const hasResultSet = Array.isArray(result) && Array.isArray(result[0]);
  const rows = hasResultSet ? (result[0] as unknown as FaqPageRow[]) : [];

  return { status: statusRows[0].status, rows };
}

export async function getFaqPage() {
  return callCrud(OPC.SELECT, null, null);
}

export async function updateFaqPage(input: FaqPageInput, idUser: number) {
  return callCrud(OPC.UPDATE, input, idUser);
}
