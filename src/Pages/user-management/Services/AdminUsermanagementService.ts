// import type { AxiosResponse } from "axios";
// import type { AdminUser, AdminUserPayload, AdminUserUpdatePayload, QueryLog } from "./AdminUsermanagementModel";
// import axiosInstance from "../../../auth/interceptor";


// export const addAdminUser = async (payload: AdminUserPayload): Promise<AxiosResponse<any>> => {
//     const response = await axiosInstance.post<any>("/AdminUser", payload);
//     return response;
// };

// export const getAllAdminUser = async (): Promise<AxiosResponse<AdminUser[]>> => {
//     const response = await axiosInstance.get<AdminUser[]>("/AdminUser");
//     return response;
// };

// export const editAdminUser = async (payload: AdminUserUpdatePayload, userId: number): Promise<AxiosResponse<any>> => {
//     const response = await axiosInstance.put<any>(`/AdminUser/${userId}`, payload);
//     return response;
// };

// export const updateAdminUserStatus = async (userId: number): Promise<AxiosResponse<any>> => {
//     const response = await axiosInstance.put<any>(`/AdminUser/${userId}/status`);
//     return response;
// };

// export const deleteAdminUser = async (userId: number): Promise<AxiosResponse<any>> => {
//     const response = await axiosInstance.delete<any>(`/AdminUser/${userId}`);
//     return response;
// };

// export const getQueryLogHistoryByUserId = async (
//     userId?: any
// ): Promise<AxiosResponse<QueryLog[]>> => {

//     const params: any = {};

//     if (
//         userId !== null &&
//         userId !== undefined &&
//         userId !== "null"
//     ) {
//         params.userId = userId;
//     }

//     const response = await axiosInstance.get<QueryLog[]>("/QueryLog", {
//         params,
//     });

//     return response;
// };

// export const updatePassword = async (paload: {
//     id: number | string;
//     newPassword: string;
//     confirmPassword: string;
// }): Promise<AxiosResponse<any>> => {
//     const response = await axiosInstance.put<any>(`/AdminUser/reset-password`, paload);
//     return response;
// }


import type { AxiosResponse } from "axios";
import axiosInstance from "../../../auth/interceptor";

import type {
  AdminUser,
  AdminUserPayload,
  AdminUserUpdatePayload,
  QueryLog,
} from "./AdminUsermanagementModel";

// Create a user using POST /User/signup.
export const addAdminUser = async (
  payload: AdminUserPayload
): Promise<AxiosResponse<any>> => {
  return axiosInstance.post("/User/signup", payload);
};

// Update a user through the same endpoint only if
// CreateUserDTO and AddOrUpdateUserAsync support identifying
// and updating an existing user.
export const editAdminUser = async (
  payload: AdminUserUpdatePayload,
  userId: string
): Promise<AxiosResponse<any>> => {
  return axiosInstance.post("/User/signup", {
    ...payload,
    id: userId,
  });
};

// The provided backend does not currently expose GET /User
// without an ID. Add a list endpoint before using this function.
export const getAllAdminUser = async (): Promise<
  AxiosResponse<AdminUser[]>
> => {
  return axiosInstance.get<AdminUser[]>("/User");
};

// Backend: PUT /User/{id}/status
export const updateAdminUserStatus = async (
  userId: string,
  active: boolean
): Promise<AxiosResponse<any>> => {
  return axiosInstance.put(`/User/${userId}/status`, {
    active,
  });
};

// Backend: DELETE /User/{id:guid}
export const deleteAdminUser = async (
  userId: string
): Promise<AxiosResponse<any>> => {
  return axiosInstance.delete(`/User/${userId}`);
};

export const getUserDetails = async (
  userId: string
): Promise<AxiosResponse<AdminUser>> => {
  return axiosInstance.get<AdminUser>(`/User/${userId}`);
};

export const getQueryLogHistoryByUserId = async (
  userId?: string | number | null
): Promise<AxiosResponse<QueryLog[]>> => {
  const params: Record<string, string | number> = {};

  if (userId !== null && userId !== undefined && userId !== "null") {
    params.userId = userId;
  }

  return axiosInstance.get<QueryLog[]>("/QueryLog", { params });
};

export const updatePassword = async (payload: {
  id: number | string;
  newPassword: string;
  confirmPassword: string;
}): Promise<AxiosResponse<any>> => {
  return axiosInstance.put("/AdminUser/reset-password", payload);
};

