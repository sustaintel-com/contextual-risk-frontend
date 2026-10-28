import type { AxiosResponse } from "axios";
import type { AdminUser, AdminUserPayload, AdminUserUpdatePayload, QueryLog } from "./AdminUsermanagementModel";
import axiosInstance from "../../../auth/interceptor";


export const addAdminUser = async (payload: AdminUserPayload): Promise<AxiosResponse<any>> => {
    const response = await axiosInstance.post<any>("/AdminUser", payload);
    return response;
};

export const getAllAdminUser = async (): Promise<AxiosResponse<AdminUser[]>> => {
    const response = await axiosInstance.get<AdminUser[]>("/AdminUser");
    return response;
};

export const editAdminUser = async (payload: AdminUserUpdatePayload, userId: number): Promise<AxiosResponse<any>> => {
    const response = await axiosInstance.put<any>(`/AdminUser/${userId}`, payload);
    return response;
};

export const updateAdminUserStatus = async (userId: number): Promise<AxiosResponse<any>> => {
    const response = await axiosInstance.put<any>(`/AdminUser/${userId}/status`);
    return response;
};

export const deleteAdminUser = async (userId: number): Promise<AxiosResponse<any>> => {
    const response = await axiosInstance.delete<any>(`/AdminUser/${userId}`);
    return response;
};

export const getQueryLogHistoryByUserId = async (
    userId?: any
): Promise<AxiosResponse<QueryLog[]>> => {

    const params: any = {};

    if (
        userId !== null &&
        userId !== undefined &&
        userId !== "null"
    ) {
        params.userId = userId;
    }

    const response = await axiosInstance.get<QueryLog[]>("/QueryLog", {
        params,
    });

    return response;
};

export const updatePassword = async (paload: {
    id: number | string;
    newPassword: string;
    confirmPassword: string;
}): Promise<AxiosResponse<any>> => {
    const response = await axiosInstance.put<any>(`/AdminUser/reset-password`, paload);
    return response;
}
