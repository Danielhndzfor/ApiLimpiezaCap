import { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

export interface MissionRow extends RowDataPacket {
  IdMission: number;
  Body: string;
  UpdatedByUserId: number | null;
  UpdatedAt: string;
}

interface StatusRow extends RowDataPacket {
  status: number;
}

const OPC = { UPDATE: 1, SELECT: 4 } as const;

async function callCrud(
  opc: number,
  body: string | null,
  idUser: number | null
): Promise<{ status: number; rows: MissionRow[] }> {
  const [result] = await pool.query<RowDataPacket[][]>('CALL sp_Mission_CRUD(?, ?, ?, @pStatus)', [
    opc,
    body,
    idUser,
  ]);
  const [statusRows] = await pool.query<StatusRow[]>('SELECT @pStatus AS status');

  const hasResultSet = Array.isArray(result) && Array.isArray(result[0]);
  const rows = hasResultSet ? (result[0] as unknown as MissionRow[]) : [];

  return { status: statusRows[0].status, rows };
}

export async function getMission() {
  return callCrud(OPC.SELECT, null, null);
}

export async function updateMission(body: string, idUser: number) {
  return callCrud(OPC.UPDATE, body, idUser);
}
