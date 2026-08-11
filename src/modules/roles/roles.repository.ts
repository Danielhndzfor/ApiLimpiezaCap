import { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

export interface RoleRow extends RowDataPacket {
  IdRole: number;
  Name: string;
  Description: string | null;
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

async function callCrud(
  opc: number,
  idRole: number | null,
  name: string | null,
  description: string | null
): Promise<{ status: number; rows: RoleRow[] }> {
  const [result] = await pool.query<RowDataPacket[][]>(
    'CALL sp_Roles_CRUD(?, ?, ?, ?, @pStatus)',
    [opc, idRole, name, description]
  );
  const [statusRows] = await pool.query<StatusRow[]>('SELECT @pStatus AS status');

  const hasResultSet = Array.isArray(result) && Array.isArray(result[0]);
  const rows = hasResultSet ? (result[0] as unknown as RoleRow[]) : [];

  return { status: statusRows[0].status, rows };
}

export async function createRole(name: string, description: string | null) {
  return callCrud(OPC.INSERT, null, name, description);
}

export async function updateRole(idRole: number, name: string, description: string | null) {
  return callCrud(OPC.UPDATE, idRole, name, description);
}

export async function deleteRole(idRole: number) {
  return callCrud(OPC.DELETE, idRole, null, null);
}

export async function getAllRoles() {
  return callCrud(OPC.SELECT_ALL, null, null, null);
}

export async function getRoleById(idRole: number) {
  return callCrud(OPC.SELECT_BY_ID, idRole, null, null);
}
