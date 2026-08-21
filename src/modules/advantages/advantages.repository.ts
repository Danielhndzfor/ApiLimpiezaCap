import { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

export interface AdvantageRow extends RowDataPacket {
  IdAdvantage: number;
  Text: string;
  UpdatedByUserId: number | null;
  UpdatedAt: string;
}

interface StatusRow extends RowDataPacket {
  status: number;
}

const OPC = { INSERT: 1, UPDATE: 2, DELETE: 3, SELECT_ALL: 4 } as const;

async function callCrud(
  opc: number,
  idAdvantage: number | null,
  text: string | null,
  idUser: number | null
): Promise<{ status: number; rows: AdvantageRow[] }> {
  const [result] = await pool.query<RowDataPacket[][]>(
    'CALL sp_Advantages_CRUD(?, ?, ?, ?, @pStatus)',
    [opc, idAdvantage, text, idUser]
  );
  const [statusRows] = await pool.query<StatusRow[]>('SELECT @pStatus AS status');

  const hasResultSet = Array.isArray(result) && Array.isArray(result[0]);
  const rows = hasResultSet ? (result[0] as unknown as AdvantageRow[]) : [];

  return { status: statusRows[0].status, rows };
}

export async function createAdvantage(text: string, idUser: number) {
  return callCrud(OPC.INSERT, null, text, idUser);
}

export async function updateAdvantage(idAdvantage: number, text: string, idUser: number) {
  return callCrud(OPC.UPDATE, idAdvantage, text, idUser);
}

export async function deleteAdvantage(idAdvantage: number) {
  return callCrud(OPC.DELETE, idAdvantage, null, null);
}

export async function getAllAdvantages() {
  return callCrud(OPC.SELECT_ALL, null, null, null);
}
