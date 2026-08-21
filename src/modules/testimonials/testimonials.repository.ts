import { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

export interface TestimonialRow extends RowDataPacket {
  IdTestimonial: number;
  Quote: string;
  Name: string;
  Source: string;
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

export interface TestimonialInput {
  quote: string;
  name: string;
  source: string;
}

async function callCrud(
  opc: number,
  idTestimonial: number | null,
  input: TestimonialInput | null,
  idUser: number | null
): Promise<{ status: number; rows: TestimonialRow[] }> {
  const [result] = await pool.query<RowDataPacket[][]>(
    'CALL sp_Testimonials_CRUD(?, ?, ?, ?, ?, ?, @pStatus)',
    [opc, idTestimonial, input?.quote ?? null, input?.name ?? null, input?.source ?? null, idUser]
  );
  const [statusRows] = await pool.query<StatusRow[]>('SELECT @pStatus AS status');

  const hasResultSet = Array.isArray(result) && Array.isArray(result[0]);
  const rows = hasResultSet ? (result[0] as unknown as TestimonialRow[]) : [];

  return { status: statusRows[0].status, rows };
}

export async function createTestimonial(input: TestimonialInput, idUser: number) {
  return callCrud(OPC.INSERT, null, input, idUser);
}

export async function updateTestimonial(idTestimonial: number, input: TestimonialInput, idUser: number) {
  return callCrud(OPC.UPDATE, idTestimonial, input, idUser);
}

export async function deleteTestimonial(idTestimonial: number) {
  return callCrud(OPC.DELETE, idTestimonial, null, null);
}

export async function getAllTestimonials() {
  return callCrud(OPC.SELECT_ALL, null, null, null);
}

export async function getTestimonialById(idTestimonial: number) {
  return callCrud(OPC.SELECT_BY_ID, idTestimonial, null, null);
}
