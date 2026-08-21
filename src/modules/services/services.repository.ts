import { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

export interface ServiceRow extends RowDataPacket {
  IdService: number;
  Slug: string;
  Num: string;
  Icon: string;
  Tag: string;
  Title: string;
  ShortDescription: string;
  LongDescription: string;
  Includes: string[] | string;
  IdealFor: string;
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
  SELECT_BY_SLUG: 6,
} as const;

export interface ServiceInput {
  slug: string;
  num: string;
  icon: string;
  tag: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  includes: string[];
  idealFor: string;
}

async function callCrud(
  opc: number,
  idService: number | null,
  slug: string | null,
  input: ServiceInput | null,
  idUser: number | null
): Promise<{ status: number; rows: ServiceRow[] }> {
  const [result] = await pool.query<RowDataPacket[][]>(
    'CALL sp_Services_CRUD(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @pStatus)',
    [
      opc,
      idService,
      slug ?? input?.slug ?? null,
      input?.num ?? null,
      input?.icon ?? null,
      input?.tag ?? null,
      input?.title ?? null,
      input?.shortDescription ?? null,
      input?.longDescription ?? null,
      input ? JSON.stringify(input.includes) : null,
      input?.idealFor ?? null,
      idUser,
    ]
  );
  const [statusRows] = await pool.query<StatusRow[]>('SELECT @pStatus AS status');

  const hasResultSet = Array.isArray(result) && Array.isArray(result[0]);
  const rows = hasResultSet ? (result[0] as unknown as ServiceRow[]) : [];

  return { status: statusRows[0].status, rows: rows.map(normalizeRow) };
}

function normalizeRow(row: ServiceRow): ServiceRow {
  if (typeof row.Includes === 'string') {
    return { ...row, Includes: JSON.parse(row.Includes) };
  }
  return row;
}

export async function createService(input: ServiceInput, idUser: number) {
  return callCrud(OPC.INSERT, null, null, input, idUser);
}

export async function updateService(idService: number, input: ServiceInput, idUser: number) {
  return callCrud(OPC.UPDATE, idService, null, input, idUser);
}

export async function deleteService(idService: number) {
  return callCrud(OPC.DELETE, idService, null, null, null);
}

export async function getAllServices() {
  return callCrud(OPC.SELECT_ALL, null, null, null, null);
}

export async function getServiceById(idService: number) {
  return callCrud(OPC.SELECT_BY_ID, idService, null, null, null);
}

export async function getServiceBySlug(slug: string) {
  return callCrud(OPC.SELECT_BY_SLUG, null, slug, null, null);
}
