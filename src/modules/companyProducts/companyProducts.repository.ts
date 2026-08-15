import { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

export interface CompanyProductsRow extends RowDataPacket {
  IdCompanyProducts: number;
  Body: string;
}

interface StatusRow extends RowDataPacket {
  status: number;
}

const OPC = { UPDATE: 1, SELECT: 4 } as const;

async function callCrud(
  opc: number,
  body: string | null
): Promise<{ status: number; rows: CompanyProductsRow[] }> {
  const [result] = await pool.query<RowDataPacket[][]>(
    'CALL sp_CompanyProducts_CRUD(?, ?, @pStatus)',
    [opc, body]
  );
  const [statusRows] = await pool.query<StatusRow[]>('SELECT @pStatus AS status');

  const hasResultSet = Array.isArray(result) && Array.isArray(result[0]);
  const rows = hasResultSet ? (result[0] as unknown as CompanyProductsRow[]) : [];

  return { status: statusRows[0].status, rows };
}

export async function getCompanyProducts() {
  return callCrud(OPC.SELECT, null);
}

export async function updateCompanyProducts(body: string) {
  return callCrud(OPC.UPDATE, body);
}
