export interface AdminUserPayload {
  email: string;
  password: string;
  roleId: number;
  name?: string;
}

export interface AdminUserUpdatePayload {
  email: string;
  roleId: number;
  name?: string;
}


export interface AdminUser {
  id: number;
  email: string;
  role: string;
  isActive: boolean;
  isDeleted: boolean;
}

export interface QueryLog {
    id: number;

    userEmail: string;

    createdAt: string;
}


