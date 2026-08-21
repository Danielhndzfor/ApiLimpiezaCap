import { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

export interface NavLinkRow extends RowDataPacket {
  IdNavLink: number;
  LinkKey: string;
  Label: string;
  SortOrder: number;
  UpdatedByUserId: number | null;
  UpdatedAt: string;
}

interface StatusRow extends RowDataPacket {
  status: number;
}

const OPC = { UPDATE: 1, SELECT_ALL: 4 } as const;

async function callCrud(
  opc: number,
  linkKey: string | null,
  label: string | null,
  idUser: number | null
): Promise<{ status: number; rows: NavLinkRow[] }> {
  const [result] = await pool.query<RowDataPacket[][]>('CALL sp_NavLinks_CRUD(?, ?, ?, ?, @pStatus)', [
    opc,
    linkKey,
    label,
    idUser,
  ]);
  const [statusRows] = await pool.query<StatusRow[]>('SELECT @pStatus AS status');

  const hasResultSet = Array.isArray(result) && Array.isArray(result[0]);
  const rows = hasResultSet ? (result[0] as unknown as NavLinkRow[]) : [];

  return { status: statusRows[0].status, rows };
}

export async function getAllNavLinks() {
  return callCrud(OPC.SELECT_ALL, null, null, null);
}

export async function updateNavLink(linkKey: string, label: string, idUser: number) {
  return callCrud(OPC.UPDATE, linkKey, label, idUser);
}
