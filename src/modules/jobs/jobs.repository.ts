import { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

export interface JobRow extends RowDataPacket {
  IdJob: number;
  Slug: string;
  Title: string;
  Type: string;
  Description: string;
  Requirements: string[] | string;
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
  SELECT_BY_SLUG: 6,
} as const;

export interface JobInput {
  slug: string;
  title: string;
  type: string;
  description: string;
  requirements: string[];
}

async function callCrud(
  opc: number,
  idJob: number | null,
  slug: string | null,
  input: JobInput | null
): Promise<{ status: number; rows: JobRow[] }> {
  const [result] = await pool.query<RowDataPacket[][]>(
    'CALL sp_Jobs_CRUD(?, ?, ?, ?, ?, ?, ?, @pStatus)',
    [
      opc,
      idJob,
      slug ?? input?.slug ?? null,
      input?.title ?? null,
      input?.type ?? null,
      input?.description ?? null,
      input ? JSON.stringify(input.requirements) : null,
    ]
  );
  const [statusRows] = await pool.query<StatusRow[]>('SELECT @pStatus AS status');

  const hasResultSet = Array.isArray(result) && Array.isArray(result[0]);
  const rows = hasResultSet ? (result[0] as unknown as JobRow[]) : [];

  return { status: statusRows[0].status, rows: rows.map(normalizeRow) };
}

function normalizeRow(row: JobRow): JobRow {
  if (typeof row.Requirements === 'string') {
    return { ...row, Requirements: JSON.parse(row.Requirements) };
  }
  return row;
}

export async function createJob(input: JobInput) {
  return callCrud(OPC.INSERT, null, null, input);
}

export async function updateJob(idJob: number, input: JobInput) {
  return callCrud(OPC.UPDATE, idJob, null, input);
}

export async function deleteJob(idJob: number) {
  return callCrud(OPC.DELETE, idJob, null, null);
}

export async function getAllJobs() {
  return callCrud(OPC.SELECT_ALL, null, null, null);
}

export async function getJobBySlug(slug: string) {
  return callCrud(OPC.SELECT_BY_SLUG, null, slug, null);
}
