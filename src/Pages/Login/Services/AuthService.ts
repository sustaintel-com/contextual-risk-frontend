
import type { AxiosResponse } from "axios";
import type {
    AuthResponse,
    LoginFormInputs,
    User,
} from "./AuthModel";

import axiosInstance from "../../../auth/interceptor";

export const userLogin = async (
    payload: LoginFormInputs
): Promise<AxiosResponse<AuthResponse>> => {
    return axiosInstance.post<AuthResponse>(
        "/Auth/login",
        payload
    );
};

export const getCurrentUser = async (): Promise<AxiosResponse<{ user: User }>> => {
    return axiosInstance.get<{ user: User }>("/Auth/me");
};

export const userLogout = async (): Promise<AxiosResponse<any>> => {
    return axiosInstance.post("/Auth/logout");
};

export const forgotPassword = async (email: string) => {
    return axiosInstance.post("/Auth/forgot-password", { email });
};

export interface ResetPasswordPayload {
    token: string;
    newPassword: string;
}

export const resetPassword = async (
    payload: ResetPasswordPayload
) => {
    return axiosInstance.post("/Auth/reset-password", payload);
};
