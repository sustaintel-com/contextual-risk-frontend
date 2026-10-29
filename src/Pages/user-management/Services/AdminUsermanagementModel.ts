
export interface AdminUserPayload {
  username: string;
  fullName: string;
  email: string;
  password: string;
  roleId: number;
}

export interface AdminUserUpdatePayload {
  id?: string;
  username: string;
  fullName: string;
  email: string;
  roleId: number;
  password?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  active: boolean | null;
}

export interface QueryLog {
  id: number;
  userEmail: string;
  createdAt: string;
}
