import { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

export interface ServicesPageRow extends RowDataPacket {
  IdServicesPage: number;
  HeroEyebrow: string;
  HeroTitle: string;
  HeroLead: string;
  ProcessTitle: string;
}

interface StatusRow extends RowDataPacket {
  status: number;
}

const OPC = { UPDATE: 1, SELECT: 4 } as const;

export interface ServicesPageInput {
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
  processTitle: string;
}

async function callCrud(
  opc: number,
  input: ServicesPageInput | null
): Promise<{ status: number; rows: ServicesPageRow[] }> {
  const [result] = await pool.query<RowDataPacket[][]>(
    'CALL sp_ServicesPage_CRUD(?, ?, ?, ?, ?, @pStatus)',
    [opc, input?.heroEyebrow ?? null, input?.heroTitle ?? null, input?.heroLead ?? null, input?.processTitle ?? null]
  );
  const [statusRows] = await pool.query<StatusRow[]>('SELECT @pStatus AS status');

  const hasResultSet = Array.isArray(result) && Array.isArray(result[0]);
  const rows = hasResultSet ? (result[0] as unknown as ServicesPageRow[]) : [];

  return { status: statusRows[0].status, rows };
}

export async function getServicesPage() {
  return callCrud(OPC.SELECT, null);
}

export async function updateServicesPage(input: ServicesPageInput) {
  return callCrud(OPC.UPDATE, input);
}
