import { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

export interface FaqItemRow extends RowDataPacket {
  IdFaqItem: number;
  Question: string;
  Answer: string;
}

interface StatusRow extends RowDataPacket {
  status: number;
}

const OPC = { INSERT: 1, UPDATE: 2, DELETE: 3, SELECT_ALL: 4 } as const;

export interface FaqItemInput {
  question: string;
  answer: string;
}

async function callCrud(
  opc: number,
  idFaqItem: number | null,
  input: FaqItemInput | null
): Promise<{ status: number; rows: FaqItemRow[] }> {
  const [result] = await pool.query<RowDataPacket[][]>(
    'CALL sp_FaqItems_CRUD(?, ?, ?, ?, @pStatus)',
    [opc, idFaqItem, input?.question ?? null, input?.answer ?? null]
  );
  const [statusRows] = await pool.query<StatusRow[]>('SELECT @pStatus AS status');

  const hasResultSet = Array.isArray(result) && Array.isArray(result[0]);
  const rows = hasResultSet ? (result[0] as unknown as FaqItemRow[]) : [];

  return { status: statusRows[0].status, rows };
}

export async function createFaqItem(input: FaqItemInput) {
  return callCrud(OPC.INSERT, null, input);
}

export async function updateFaqItem(idFaqItem: number, input: FaqItemInput) {
  return callCrud(OPC.UPDATE, idFaqItem, input);
}

export async function deleteFaqItem(idFaqItem: number) {
  return callCrud(OPC.DELETE, idFaqItem, null);
}

export async function getAllFaqItems() {
  return callCrud(OPC.SELECT_ALL, null, null);
}
