import { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

export interface TrainingRow extends RowDataPacket {
  IdTraining: number;
  Text: string;
}

interface StatusRow extends RowDataPacket {
  status: number;
}

const OPC = { INSERT: 1, UPDATE: 2, DELETE: 3, SELECT_ALL: 4 } as const;

async function callCrud(
  opc: number,
  idTraining: number | null,
  text: string | null
): Promise<{ status: number; rows: TrainingRow[] }> {
  const [result] = await pool.query<RowDataPacket[][]>(
    'CALL sp_Trainings_CRUD(?, ?, ?, @pStatus)',
    [opc, idTraining, text]
  );
  const [statusRows] = await pool.query<StatusRow[]>('SELECT @pStatus AS status');

  const hasResultSet = Array.isArray(result) && Array.isArray(result[0]);
  const rows = hasResultSet ? (result[0] as unknown as TrainingRow[]) : [];

  return { status: statusRows[0].status, rows };
}

export async function createTraining(text: string) {
  return callCrud(OPC.INSERT, null, text);
}

export async function updateTraining(idTraining: number, text: string) {
  return callCrud(OPC.UPDATE, idTraining, text);
}

export async function deleteTraining(idTraining: number) {
  return callCrud(OPC.DELETE, idTraining, null);
}

export async function getAllTrainings() {
  return callCrud(OPC.SELECT_ALL, null, null);
}
