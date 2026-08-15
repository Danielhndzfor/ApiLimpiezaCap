import { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

export interface RecentWorkPageRow extends RowDataPacket {
  IdRecentWorkPage: number;
  HeroEyebrow: string;
  HeroTitle: string;
  HeroLead: string;
}

interface StatusRow extends RowDataPacket {
  status: number;
}

const OPC = { UPDATE: 1, SELECT: 4 } as const;

export interface RecentWorkPageInput {
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
}

async function callCrud(
  opc: number,
  input: RecentWorkPageInput | null
): Promise<{ status: number; rows: RecentWorkPageRow[] }> {
  const [result] = await pool.query<RowDataPacket[][]>(
    'CALL sp_RecentWorkPage_CRUD(?, ?, ?, ?, @pStatus)',
    [opc, input?.heroEyebrow ?? null, input?.heroTitle ?? null, input?.heroLead ?? null]
  );
  const [statusRows] = await pool.query<StatusRow[]>('SELECT @pStatus AS status');

  const hasResultSet = Array.isArray(result) && Array.isArray(result[0]);
  const rows = hasResultSet ? (result[0] as unknown as RecentWorkPageRow[]) : [];

  return { status: statusRows[0].status, rows };
}

export async function getRecentWorkPage() {
  return callCrud(OPC.SELECT, null);
}

export async function updateRecentWorkPage(input: RecentWorkPageInput) {
  return callCrud(OPC.UPDATE, input);
}
