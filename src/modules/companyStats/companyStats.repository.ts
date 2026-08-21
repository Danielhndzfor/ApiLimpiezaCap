import { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

export interface CompanyStatsRow extends RowDataPacket {
  IdCompanyStats: number;
  Years: number;
  Clients: number;
  SquareMetersK: number;
  UpdatedByUserId: number | null;
  UpdatedAt: string;
}

interface StatusRow extends RowDataPacket {
  status: number;
}

const OPC = { UPDATE: 1, SELECT: 4 } as const;

export interface CompanyStatsInput {
  years: number;
  clients: number;
  squareMetersK: number;
}

async function callCrud(
  opc: number,
  input: CompanyStatsInput | null,
  idUser: number | null
): Promise<{ status: number; rows: CompanyStatsRow[] }> {
  const [result] = await pool.query<RowDataPacket[][]>(
    'CALL sp_CompanyStats_CRUD(?, ?, ?, ?, ?, @pStatus)',
    [opc, input?.years ?? null, input?.clients ?? null, input?.squareMetersK ?? null, idUser]
  );
  const [statusRows] = await pool.query<StatusRow[]>('SELECT @pStatus AS status');

  const hasResultSet = Array.isArray(result) && Array.isArray(result[0]);
  const rows = hasResultSet ? (result[0] as unknown as CompanyStatsRow[]) : [];

  return { status: statusRows[0].status, rows };
}

export async function getCompanyStats() {
  return callCrud(OPC.SELECT, null, null);
}

export async function updateCompanyStats(input: CompanyStatsInput, idUser: number) {
  return callCrud(OPC.UPDATE, input, idUser);
}
