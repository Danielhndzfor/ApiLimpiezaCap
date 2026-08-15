import { RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';
import { UserForLogin } from './auth.types';

interface OutParamsRow extends RowDataPacket {
  idUser: number | null;
  status: number;
}

export async function getRoleIdByName(name: string): Promise<number | null> {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT IdRole FROM Roles WHERE Name = ? LIMIT 1', [
    name,
  ]);
  return (rows[0]?.IdRole as number | undefined) ?? null;
}

export async function registerUser(
  userName: string,
  pass: string,
  idRole: number | null
): Promise<{ idUser: number | null; status: number }> {
  await pool.query('CALL sp_Users_Register(?, ?, ?, @pIdUser, @pStatus)', [
    userName,
    pass,
    idRole,
  ]);
  const [rows] = await pool.query<OutParamsRow[]>(
    'SELECT @pIdUser AS idUser, @pStatus AS status'
  );
  return rows[0];
}

export async function getUserForLogin(userName: string): Promise<UserForLogin | null> {
  const [rows] = await pool.query<RowDataPacket[][]>('CALL sp_Users_GetForLogin(?)', [
    userName,
  ]);
  const resultSet = rows[0] as unknown as UserForLogin[];
  return resultSet[0] ?? null;
}

export async function registerLoginAttempt(idUser: number, success: boolean): Promise<void> {
  await pool.query('CALL sp_Users_RegisterLoginAttempt(?, ?)', [idUser, success ? 1 : 0]);
}

export async function updatePassword(idUser: number, passHash: string): Promise<void> {
  await pool.query('CALL sp_Users_UpdatePassword(?, ?)', [idUser, passHash]);
}

export async function getUserByIdForLogin(idUser: number): Promise<UserForLogin | null> {
  const [rows] = await pool.query<RowDataPacket[][]>('CALL sp_Users_GetById(?)', [idUser]);
  const resultSet = rows[0] as unknown as UserForLogin[];
  return resultSet[0] ?? null;
}
