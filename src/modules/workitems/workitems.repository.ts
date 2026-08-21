import { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

export interface WorkItemRow extends RowDataPacket {
  IdWorkItem: number;
  Tag: string;
  Title: string;
  ImageUrl: string | null;
  UpdatedByUserId: number | null;
  UpdatedAt: string;
}

interface StatusRow extends RowDataPacket {
  status: number;
}

const OPC = {
  INSERT: 1,
  UPDATE: 2,
  DELETE: 3,
  SELECT_ALL: 4,
  SELECT_BY_ID: 5,
} as const;

export interface WorkItemInput {
  tag: string;
  title: string;
  imageUrl: string | null;
}

async function callCrud(
  opc: number,
  idWorkItem: number | null,
  input: WorkItemInput | null,
  idUser: number | null
): Promise<{ status: number; rows: WorkItemRow[] }> {
  const [result] = await pool.query<RowDataPacket[][]>(
    'CALL sp_WorkItems_CRUD(?, ?, ?, ?, ?, ?, @pStatus)',
    [opc, idWorkItem, input?.tag ?? null, input?.title ?? null, input?.imageUrl ?? null, idUser]
  );
  const [statusRows] = await pool.query<StatusRow[]>('SELECT @pStatus AS status');

  const hasResultSet = Array.isArray(result) && Array.isArray(result[0]);
  const rows = hasResultSet ? (result[0] as unknown as WorkItemRow[]) : [];

  return { status: statusRows[0].status, rows };
}

export async function createWorkItem(input: WorkItemInput, idUser: number) {
  return callCrud(OPC.INSERT, null, input, idUser);
}

export async function updateWorkItem(idWorkItem: number, input: WorkItemInput, idUser: number) {
  return callCrud(OPC.UPDATE, idWorkItem, input, idUser);
}

export async function deleteWorkItem(idWorkItem: number) {
  return callCrud(OPC.DELETE, idWorkItem, null, null);
}

export async function getAllWorkItems() {
  return callCrud(OPC.SELECT_ALL, null, null, null);
}

export async function getWorkItemById(idWorkItem: number) {
  return callCrud(OPC.SELECT_BY_ID, idWorkItem, null, null);
}
