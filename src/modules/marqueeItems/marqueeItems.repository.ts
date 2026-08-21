import { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

export interface MarqueeItemRow extends RowDataPacket {
  IdMarqueeItem: number;
  Text: string;
  UpdatedByUserId: number | null;
  UpdatedAt: string;
}

interface StatusRow extends RowDataPacket {
  status: number;
}

const OPC = { INSERT: 1, UPDATE: 2, DELETE: 3, SELECT_ALL: 4, MOVE_UP: 5, MOVE_DOWN: 6 } as const;

async function callCrud(
  opc: number,
  idMarqueeItem: number | null,
  text: string | null,
  idUser: number | null
): Promise<{ status: number; rows: MarqueeItemRow[] }> {
  const [result] = await pool.query<RowDataPacket[][]>(
    'CALL sp_MarqueeItems_CRUD(?, ?, ?, ?, @pStatus)',
    [opc, idMarqueeItem, text, idUser]
  );
  const [statusRows] = await pool.query<StatusRow[]>('SELECT @pStatus AS status');

  const hasResultSet = Array.isArray(result) && Array.isArray(result[0]);
  const rows = hasResultSet ? (result[0] as unknown as MarqueeItemRow[]) : [];

  return { status: statusRows[0].status, rows };
}

export async function createMarqueeItem(text: string, idUser: number) {
  return callCrud(OPC.INSERT, null, text, idUser);
}

export async function updateMarqueeItem(idMarqueeItem: number, text: string, idUser: number) {
  return callCrud(OPC.UPDATE, idMarqueeItem, text, idUser);
}

export async function deleteMarqueeItem(idMarqueeItem: number) {
  return callCrud(OPC.DELETE, idMarqueeItem, null, null);
}

export async function getAllMarqueeItems() {
  return callCrud(OPC.SELECT_ALL, null, null, null);
}

export async function moveMarqueeItemUp(idMarqueeItem: number, idUser: number) {
  return callCrud(OPC.MOVE_UP, idMarqueeItem, null, idUser);
}

export async function moveMarqueeItemDown(idMarqueeItem: number, idUser: number) {
  return callCrud(OPC.MOVE_DOWN, idMarqueeItem, null, idUser);
}

export async function reorderMarqueeItems(orderedIds: number[], idUser: number): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    for (let i = 0; i < orderedIds.length; i += 1) {
      await connection.query(
        'UPDATE MarqueeItems SET SortOrder = ?, UpdatedByUserId = ? WHERE IdMarqueeItem = ?',
        [i + 1, idUser, orderedIds[i]]
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
