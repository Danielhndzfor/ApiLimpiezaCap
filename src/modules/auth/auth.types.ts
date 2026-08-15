export interface RegisterInput {
  userName: string;
  password: string;
  inviteKey?: string;
}

export interface LoginInput {
  userName: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthenticatedUser {
  idUser: number;
  userName: string;
  idRole: number;
  roleName: string;
}

export interface UserForLogin {
  IdUser: number;
  UserName: string;
  Pass: string;
  IdRole: number;
  RoleName: string;
  Activo: number;
  FailedAttempts: number;
  LockedUntil: Date | null;
}
