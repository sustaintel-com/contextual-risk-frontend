
import type { AxiosResponse } from "axios";
import axiosInstance from "../../../auth/interceptor";

import type {
  AdminUser,
  AdminUserPayload,
  AdminUserUpdatePayload,
  IdType,
  QueryLog,
  Role,
} from "./AdminUsermanagementModel";

// GET /Role
export const getAllRoles = async (): Promise<AxiosResponse<Role[]>> => {
  return axiosInstance.get<Role[]>("/Role");
};

// POST /User/signup
export const addAdminUser = async (
  payload: AdminUserPayload
): Promise<AxiosResponse<any>> => {
  return axiosInstance.post("/User/signup", payload);
};

// POST /User/signup
// Requires CreateUserDTO and AddOrUpdateUserAsync to support updating
// an existing user using the supplied ID.
export const editAdminUser = async (
  payload: AdminUserUpdatePayload,
  userId: IdType
): Promise<AxiosResponse<any>> => {
  return axiosInstance.post("/User/signup", {
    ...payload,
    id: userId,
  });
};

// GET /User/{id}
export const getUserDetails = async (
  userId: IdType
): Promise<AxiosResponse<AdminUser>> => {
  return axiosInstance.get<AdminUser>(`/User/${userId}`);
};

// The provided UserController has no GET /User list endpoint.
// This function requires a backend list endpoint to be added.
export const getAllAdminUser = async (): Promise<
  AxiosResponse<AdminUser[]>
> => {
  return axiosInstance.get<AdminUser[]>("/User");
};

// PUT /User/{id}/status
export const updateAdminUserStatus = async (
  userId: IdType,
  active: boolean
): Promise<AxiosResponse<any>> => {
  return axiosInstance.put(`/User/${userId}/status`, {
    active,
  });
};

// DELETE /User/{id:guid}
export const deleteAdminUser = async (
  userId: string
): Promise<AxiosResponse<any>> => {
  return axiosInstance.delete(`/User/${userId}`);
};

export const getQueryLogHistoryByUserId = async (
  userId?: IdType | null
): Promise<AxiosResponse<QueryLog[]>> => {
  const params: Record<string, IdType> = {};

  if (
    userId !== null &&
    userId !== undefined &&
    userId !== "null"
  ) {
    params.userId = userId;
  }

  return axiosInstance.get<QueryLog[]>("/QueryLog", { params });
};

// Keep this only if the separate AdminUser reset-password endpoint
// still exists in your backend.
export const updatePassword = async (payload: {
  id: IdType;
  newPassword: string;
  confirmPassword: string;
}): Promise<AxiosResponse<any>> => {
  return axiosInstance.put("/AdminUser/reset-password", payload);
};
