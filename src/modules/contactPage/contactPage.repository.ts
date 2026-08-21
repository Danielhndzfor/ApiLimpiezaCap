import { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

export interface ContactPageRow extends RowDataPacket {
  IdContactPage: number;
  HeroEyebrow: string;
  HeroTitle: string;
  HeroLead: string;
  OfficeEyebrow: string;
  OfficeTitle: string;
  OfficePhoto1Url: string | null;
  OfficePhoto2Url: string | null;
  OfficePhoto3Url: string | null;
  UpdatedByUserId: number | null;
  UpdatedAt: string;
}

interface StatusRow extends RowDataPacket {
  status: number;
}

const OPC = { UPDATE: 1, SELECT: 4 } as const;

export interface ContactPageInput {
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
  officeEyebrow: string;
  officeTitle: string;
  officePhoto1Url: string | null;
  officePhoto2Url: string | null;
  officePhoto3Url: string | null;
}

async function callCrud(
  opc: number,
  input: ContactPageInput | null,
  idUser: number | null
): Promise<{ status: number; rows: ContactPageRow[] }> {
  const [result] = await pool.query<RowDataPacket[][]>(
    'CALL sp_ContactPage_CRUD(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @pStatus)',
    [
      opc,
      input?.heroEyebrow ?? null,
      input?.heroTitle ?? null,
      input?.heroLead ?? null,
      input?.officeEyebrow ?? null,
      input?.officeTitle ?? null,
      input?.officePhoto1Url ?? null,
      input?.officePhoto2Url ?? null,
      input?.officePhoto3Url ?? null,
      idUser,
    ]
  );
  const [statusRows] = await pool.query<StatusRow[]>('SELECT @pStatus AS status');

  const hasResultSet = Array.isArray(result) && Array.isArray(result[0]);
  const rows = hasResultSet ? (result[0] as unknown as ContactPageRow[]) : [];

  return { status: statusRows[0].status, rows };
}

export async function getContactPage() {
  return callCrud(OPC.SELECT, null, null);
}

export async function updateContactPage(input: ContactPageInput, idUser: number) {
  return callCrud(OPC.UPDATE, input, idUser);
}
