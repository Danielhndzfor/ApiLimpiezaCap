import { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

interface OutIdTokenRow extends RowDataPacket {
  idToken: number;
}

export interface RefreshTokenRow extends RowDataPacket {
  IdToken: number;
  IdUser: number;
  Token: string;
  CreatedAt: Date;
  ExpiredAt: Date;
  Revoked: number;
}

export async function createRefreshToken(
  idUser: number,
  token: string,
  expiredAt: Date
): Promise<number> {
  await pool.query('CALL sp_RefreshTokens_Create(?, ?, ?, @pIdToken)', [
    idUser,
    token,
    expiredAt,
  ]);
  const [rows] = await pool.query<OutIdTokenRow[]>('SELECT @pIdToken AS idToken');
  return rows[0].idToken;
}

export async function getValidRefreshToken(token: string): Promise<RefreshTokenRow | null> {
  const [rows] = await pool.query<RowDataPacket[][]>('CALL sp_RefreshTokens_GetValid(?)', [
    token,
  ]);
  const resultSet = rows[0] as unknown as RefreshTokenRow[];
  return resultSet[0] ?? null;
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await pool.query('CALL sp_RefreshTokens_Revoke(?)', [token]);
}

export async function revokeAllRefreshTokensByUser(idUser: number): Promise<void> {
  await pool.query('CALL sp_RefreshTokens_RevokeAllByUser(?)', [idUser]);
}
