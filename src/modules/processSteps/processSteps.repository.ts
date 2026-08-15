import { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

export interface ProcessStepRow extends RowDataPacket {
  IdProcessStep: number;
  N: string;
  Title: string;
  Description: string;
}

interface StatusRow extends RowDataPacket {
  status: number;
}

const OPC = { INSERT: 1, UPDATE: 2, DELETE: 3, SELECT_ALL: 4 } as const;

export interface ProcessStepInput {
  n: string;
  title: string;
  description: string;
}

async function callCrud(
  opc: number,
  idProcessStep: number | null,
  input: ProcessStepInput | null
): Promise<{ status: number; rows: ProcessStepRow[] }> {
  const [result] = await pool.query<RowDataPacket[][]>(
    'CALL sp_ProcessSteps_CRUD(?, ?, ?, ?, ?, @pStatus)',
    [opc, idProcessStep, input?.n ?? null, input?.title ?? null, input?.description ?? null]
  );
  const [statusRows] = await pool.query<StatusRow[]>('SELECT @pStatus AS status');

  const hasResultSet = Array.isArray(result) && Array.isArray(result[0]);
  const rows = hasResultSet ? (result[0] as unknown as ProcessStepRow[]) : [];

  return { status: statusRows[0].status, rows };
}

export async function createProcessStep(input: ProcessStepInput) {
  return callCrud(OPC.INSERT, null, input);
}

export async function updateProcessStep(idProcessStep: number, input: ProcessStepInput) {
  return callCrud(OPC.UPDATE, idProcessStep, input);
}

export async function deleteProcessStep(idProcessStep: number) {
  return callCrud(OPC.DELETE, idProcessStep, null);
}

export async function getAllProcessSteps() {
  return callCrud(OPC.SELECT_ALL, null, null);
}
