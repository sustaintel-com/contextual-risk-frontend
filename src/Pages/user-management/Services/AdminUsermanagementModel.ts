export type IdType = string;

export interface Role {
  roleId: IdType;
  name: string;
}

export interface RoleOption {
  label: string;
  value: IdType;
}

export interface AdminUserPayload {
  username: string;
  fullName: string;
  email: string;
  password: string;
  roleId: IdType[];
}

export interface AdminUserUpdatePayload {
  id?: IdType;
  username: string;
  fullName: string;
  email: string;
  roleId: IdType[];
  password?: string;
}

export interface AdminUser {
  id: IdType;
  username: string;
  fullName: string;
  email: string;
  active: boolean | null;

  // These names match the GET /User response.
  roleIds: IdType[];
  roleNames: string[];

  createdBy?: IdType | null;
  updatedBy?: IdType | null;

  // Optional compatibility fields for other endpoints.
  roleId?: IdType[];
  roles?: Role[];
  createdAt?: string;
  updatedAt?: string;
}

export interface QueryLog {
  id: number;
  userEmail: string;
  createdAt: string;
}