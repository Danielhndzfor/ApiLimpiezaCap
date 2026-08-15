import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { AppError } from '../../utils/AppError';
import { parseDurationToMs } from '../../utils/duration';
import * as authRepository from './auth.repository';
import * as refreshTokenRepository from './refreshToken.repository';
import { AuthTokens, AuthenticatedUser, LoginInput, RegisterInput } from './auth.types';

const SALT_ROUNDS = 10;
const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$.{53}$/;

function isBcryptHash(value: string): boolean {
  return BCRYPT_HASH_PATTERN.test(value);
}

function toAuthenticatedUser(
  idUser: number,
  userName: string,
  idRole: number,
  roleName: string
): AuthenticatedUser {
  return { idUser, userName, idRole, roleName };
}

function generateAccessToken(user: AuthenticatedUser): string {
  return jwt.sign(
    { sub: user.idUser, role: user.roleName },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn } as jwt.SignOptions
  );
}

function generateRefreshTokenValue(user: AuthenticatedUser): string {
  return jwt.sign({ sub: user.idUser }, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn,
  } as jwt.SignOptions);
}

async function issueTokens(user: AuthenticatedUser): Promise<AuthTokens> {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshTokenValue(user);
  const expiredAt = new Date(Date.now() + parseDurationToMs(env.jwt.refreshExpiresIn));

  await refreshTokenRepository.createRefreshToken(user.idUser, refreshToken, expiredAt);

  return { accessToken, refreshToken };
}

export async function register(
  input: RegisterInput
): Promise<{ idUser: number; user: AuthenticatedUser }> {
  const passHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const idRole =
    input.inviteKey && input.inviteKey === env.adminInviteKey
      ? await authRepository.getRoleIdByName('admin')
      : null;

  const result = await authRepository.registerUser(input.userName, passHash, idRole);

  if (result.status === 1) {
    throw new AppError('El nombre de usuario ya está registrado', 409);
  }
  if (result.status === 2) {
    throw new AppError('El rol especificado no existe', 400);
  }
  if (!result.idUser) {
    throw new AppError('No se pudo registrar el usuario', 500);
  }

  const userForLogin = await authRepository.getUserForLogin(input.userName);
  if (!userForLogin) {
    throw new AppError('No se pudo obtener el usuario recién registrado', 500);
  }

  const user = toAuthenticatedUser(
    userForLogin.IdUser,
    userForLogin.UserName,
    userForLogin.IdRole,
    userForLogin.RoleName
  );

  return { idUser: result.idUser, user };
}

export async function login(
  input: LoginInput
): Promise<{ user: AuthenticatedUser; tokens: AuthTokens }> {
  const userRow = await authRepository.getUserForLogin(input.userName);

  if (!userRow) {
    throw new AppError('Credenciales inválidas', 401);
  }

  if (!userRow.Activo) {
    throw new AppError('El usuario está inactivo', 403);
  }

  if (userRow.LockedUntil && new Date(userRow.LockedUntil).getTime() > Date.now()) {
    throw new AppError('Cuenta bloqueada temporalmente por intentos fallidos', 423);
  }

  const storedPassIsHashed = isBcryptHash(userRow.Pass);
  const passwordMatches = storedPassIsHashed
    ? await bcrypt.compare(input.password, userRow.Pass)
    : input.password === userRow.Pass;

  if (!passwordMatches) {
    await authRepository.registerLoginAttempt(userRow.IdUser, false);
    throw new AppError('Credenciales inválidas', 401);
  }

  if (!storedPassIsHashed) {
    // Contraseña editada a mano (ej. en phpMyAdmin) en texto plano: se re-hashea
    // automáticamente ahora que se verificó, para que quede protegida en la BD.
    const newHash = await bcrypt.hash(input.password, SALT_ROUNDS);
    await authRepository.updatePassword(userRow.IdUser, newHash);
  }

  await authRepository.registerLoginAttempt(userRow.IdUser, true);

  const user = toAuthenticatedUser(
    userRow.IdUser,
    userRow.UserName,
    userRow.IdRole,
    userRow.RoleName
  );

  const tokens = await issueTokens(user);

  return { user, tokens };
}

export async function refresh(refreshToken: string): Promise<AuthTokens> {
  let payload: { sub: number };
  try {
    payload = jwt.verify(refreshToken, env.jwt.refreshSecret) as unknown as { sub: number };
  } catch {
    throw new AppError('Refresh token inválido o expirado', 401);
  }

  const storedToken = await refreshTokenRepository.getValidRefreshToken(refreshToken);
  if (!storedToken) {
    throw new AppError('Refresh token inválido, expirado o revocado', 401);
  }

  const user = await getUserById(payload.sub);

  await refreshTokenRepository.revokeRefreshToken(refreshToken);

  return issueTokens(user);
}

async function getUserById(idUser: number): Promise<AuthenticatedUser> {
  const userRow = await authRepository.getUserByIdForLogin(idUser);
  if (!userRow) {
    throw new AppError('Usuario no encontrado', 401);
  }
  return toAuthenticatedUser(
    userRow.IdUser,
    userRow.UserName,
    userRow.IdRole,
    userRow.RoleName
  );
}

export async function logout(refreshToken: string): Promise<void> {
  await refreshTokenRepository.revokeRefreshToken(refreshToken);
}
