import { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

export interface SecurityMeasureRow extends RowDataPacket {
  IdSecurityMeasure: number;
  Text: string;
}

interface StatusRow extends RowDataPacket {
  status: number;
}

const OPC = { INSERT: 1, UPDATE: 2, DELETE: 3, SELECT_ALL: 4 } as const;

async function callCrud(
  opc: number,
  idSecurityMeasure: number | null,
  text: string | null
): Promise<{ status: number; rows: SecurityMeasureRow[] }> {
  const [result] = await pool.query<RowDataPacket[][]>(
    'CALL sp_SecurityMeasures_CRUD(?, ?, ?, @pStatus)',
    [opc, idSecurityMeasure, text]
  );
  const [statusRows] = await pool.query<StatusRow[]>('SELECT @pStatus AS status');

  const hasResultSet = Array.isArray(result) && Array.isArray(result[0]);
  const rows = hasResultSet ? (result[0] as unknown as SecurityMeasureRow[]) : [];

  return { status: statusRows[0].status, rows };
}

export async function createSecurityMeasure(text: string) {
  return callCrud(OPC.INSERT, null, text);
}

export async function updateSecurityMeasure(idSecurityMeasure: number, text: string) {
  return callCrud(OPC.UPDATE, idSecurityMeasure, text);
}

export async function deleteSecurityMeasure(idSecurityMeasure: number) {
  return callCrud(OPC.DELETE, idSecurityMeasure, null);
}

export async function getAllSecurityMeasures() {
  return callCrud(OPC.SELECT_ALL, null, null);
}
