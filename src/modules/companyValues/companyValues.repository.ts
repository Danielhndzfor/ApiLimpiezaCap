import { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

export interface CompanyValueRow extends RowDataPacket {
  IdValue: number;
  Icon: string;
  Title: string;
}

interface StatusRow extends RowDataPacket {
  status: number;
}

const OPC = { INSERT: 1, UPDATE: 2, DELETE: 3, SELECT_ALL: 4 } as const;

export interface CompanyValueInput {
  icon: string;
  title: string;
}

async function callCrud(
  opc: number,
  idValue: number | null,
  input: CompanyValueInput | null
): Promise<{ status: number; rows: CompanyValueRow[] }> {
  const [result] = await pool.query<RowDataPacket[][]>(
    'CALL sp_CompanyValues_CRUD(?, ?, ?, ?, @pStatus)',
    [opc, idValue, input?.icon ?? null, input?.title ?? null]
  );
  const [statusRows] = await pool.query<StatusRow[]>('SELECT @pStatus AS status');

  const hasResultSet = Array.isArray(result) && Array.isArray(result[0]);
  const rows = hasResultSet ? (result[0] as unknown as CompanyValueRow[]) : [];

  return { status: statusRows[0].status, rows };
}

export async function createCompanyValue(input: CompanyValueInput) {
  return callCrud(OPC.INSERT, null, input);
}

export async function updateCompanyValue(idValue: number, input: CompanyValueInput) {
  return callCrud(OPC.UPDATE, idValue, input);
}

export async function deleteCompanyValue(idValue: number) {
  return callCrud(OPC.DELETE, idValue, null);
}

export async function getAllCompanyValues() {
  return callCrud(OPC.SELECT_ALL, null, null);
}
