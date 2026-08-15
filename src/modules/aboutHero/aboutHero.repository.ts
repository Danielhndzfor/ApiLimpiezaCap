import { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

export interface AboutHeroRow extends RowDataPacket {
  IdAboutHero: number;
  Eyebrow: string;
  Title: string;
  TitleHighlight: string;
  Lead: string;
  BadgeText: string;
  PhotoUrl: string | null;
  ValuesEyebrow: string;
  ValuesTitle: string;
  OperationEyebrow: string;
  OperationTitle: string;
  JobsEyebrow: string;
  JobsTitle: string;
  JobsLead: string;
}

interface StatusRow extends RowDataPacket {
  status: number;
}

const OPC = { UPDATE: 1, SELECT: 4 } as const;

export interface AboutHeroInput {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  lead: string;
  badgeText: string;
  photoUrl: string | null;
  valuesEyebrow: string;
  valuesTitle: string;
  operationEyebrow: string;
  operationTitle: string;
  jobsEyebrow: string;
  jobsTitle: string;
  jobsLead: string;
}

async function callCrud(
  opc: number,
  input: AboutHeroInput | null
): Promise<{ status: number; rows: AboutHeroRow[] }> {
  const [result] = await pool.query<RowDataPacket[][]>(
    'CALL sp_AboutHero_CRUD(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @pStatus)',
    [
      opc,
      input?.eyebrow ?? null,
      input?.title ?? null,
      input?.titleHighlight ?? null,
      input?.lead ?? null,
      input?.badgeText ?? null,
      input?.photoUrl ?? null,
      input?.valuesEyebrow ?? null,
      input?.valuesTitle ?? null,
      input?.operationEyebrow ?? null,
      input?.operationTitle ?? null,
      input?.jobsEyebrow ?? null,
      input?.jobsTitle ?? null,
      input?.jobsLead ?? null,
    ]
  );
  const [statusRows] = await pool.query<StatusRow[]>('SELECT @pStatus AS status');

  const hasResultSet = Array.isArray(result) && Array.isArray(result[0]);
  const rows = hasResultSet ? (result[0] as unknown as AboutHeroRow[]) : [];

  return { status: statusRows[0].status, rows };
}

export async function getAboutHero() {
  return callCrud(OPC.SELECT, null);
}

export async function updateAboutHero(input: AboutHeroInput) {
  return callCrud(OPC.UPDATE, input);
}
