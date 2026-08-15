import { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

export interface ContactInfoRow extends RowDataPacket {
  IdContactInfo: number;
  PhoneDisplay: string;
  PhoneHref: string;
  WhatsappNumber: string;
  Email: string;
  Address: string;
  Hours: string;
  Tagline: string;
}

interface StatusRow extends RowDataPacket {
  status: number;
}

const OPC = { UPDATE: 1, SELECT: 4 } as const;

export interface ContactInfoInput {
  phoneDisplay: string;
  phoneHref: string;
  whatsappNumber: string;
  email: string;
  address: string;
  hours: string;
  tagline: string;
}

async function callCrud(
  opc: number,
  input: ContactInfoInput | null
): Promise<{ status: number; rows: ContactInfoRow[] }> {
  const [result] = await pool.query<RowDataPacket[][]>(
    'CALL sp_ContactInfo_CRUD(?, ?, ?, ?, ?, ?, ?, ?, @pStatus)',
    [
      opc,
      input?.phoneDisplay ?? null,
      input?.phoneHref ?? null,
      input?.whatsappNumber ?? null,
      input?.email ?? null,
      input?.address ?? null,
      input?.hours ?? null,
      input?.tagline ?? null,
    ]
  );
  const [statusRows] = await pool.query<StatusRow[]>('SELECT @pStatus AS status');

  const hasResultSet = Array.isArray(result) && Array.isArray(result[0]);
  const rows = hasResultSet ? (result[0] as unknown as ContactInfoRow[]) : [];

  return { status: statusRows[0].status, rows };
}

export async function getContactInfo() {
  return callCrud(OPC.SELECT, null);
}

export async function updateContactInfo(input: ContactInfoInput) {
  return callCrud(OPC.UPDATE, input);
}
