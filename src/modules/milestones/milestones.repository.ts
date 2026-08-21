import { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

export interface MilestoneRow extends RowDataPacket {
  IdMilestone: number;
  YearLabel: string;
  Title: string;
  Description: string;
  UpdatedByUserId: number | null;
  UpdatedAt: string;
}

interface StatusRow extends RowDataPacket {
  status: number;
}

const OPC = { INSERT: 1, UPDATE: 2, DELETE: 3, SELECT_ALL: 4 } as const;

export interface MilestoneInput {
  yearLabel: string;
  title: string;
  description: string;
}

async function callCrud(
  opc: number,
  idMilestone: number | null,
  input: MilestoneInput | null,
  idUser: number | null
): Promise<{ status: number; rows: MilestoneRow[] }> {
  const [result] = await pool.query<RowDataPacket[][]>(
    'CALL sp_Milestones_CRUD(?, ?, ?, ?, ?, ?, @pStatus)',
    [opc, idMilestone, input?.yearLabel ?? null, input?.title ?? null, input?.description ?? null, idUser]
  );
  const [statusRows] = await pool.query<StatusRow[]>('SELECT @pStatus AS status');

  const hasResultSet = Array.isArray(result) && Array.isArray(result[0]);
  const rows = hasResultSet ? (result[0] as unknown as MilestoneRow[]) : [];

  return { status: statusRows[0].status, rows };
}

export async function createMilestone(input: MilestoneInput, idUser: number) {
  return callCrud(OPC.INSERT, null, input, idUser);
}

export async function updateMilestone(idMilestone: number, input: MilestoneInput, idUser: number) {
  return callCrud(OPC.UPDATE, idMilestone, input, idUser);
}

export async function deleteMilestone(idMilestone: number) {
  return callCrud(OPC.DELETE, idMilestone, null, null);
}

export async function getAllMilestones() {
  return callCrud(OPC.SELECT_ALL, null, null, null);
}
