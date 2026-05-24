export interface IModerator {
  id: string;
  created_at: Date;
  updated_at: Date;
  login: string;
  passwordHash: string | null;
  refreshTokenHash: string | null;
  isAdmin: boolean;
}

export interface IAuthType {
  login: string;
  password: string;
}
