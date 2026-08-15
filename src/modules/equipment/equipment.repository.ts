import { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

export interface EquipmentRow extends RowDataPacket {
  IdEquipment: number;
  Text: string;
}

interface StatusRow extends RowDataPacket {
  status: number;
}

const OPC = { INSERT: 1, UPDATE: 2, DELETE: 3, SELECT_ALL: 4 } as const;

async function callCrud(
  opc: number,
  idEquipment: number | null,
  text: string | null
): Promise<{ status: number; rows: EquipmentRow[] }> {
  const [result] = await pool.query<RowDataPacket[][]>(
    'CALL sp_Equipment_CRUD(?, ?, ?, @pStatus)',
    [opc, idEquipment, text]
  );
  const [statusRows] = await pool.query<StatusRow[]>('SELECT @pStatus AS status');

  const hasResultSet = Array.isArray(result) && Array.isArray(result[0]);
  const rows = hasResultSet ? (result[0] as unknown as EquipmentRow[]) : [];

  return { status: statusRows[0].status, rows };
}

export async function createEquipment(text: string) {
  return callCrud(OPC.INSERT, null, text);
}

export async function updateEquipment(idEquipment: number, text: string) {
  return callCrud(OPC.UPDATE, idEquipment, text);
}

export async function deleteEquipment(idEquipment: number) {
  return callCrud(OPC.DELETE, idEquipment, null);
}

export async function getAllEquipment() {
  return callCrud(OPC.SELECT_ALL, null, null);
}
