import type { AxiosResponse } from "axios";
import type { AuthResponse, LoginFormInputs } from "./AuthModel";
import axiosInstance from "../../../auth/interceptor";



export const userLogin = async (payload: LoginFormInputs): Promise<AxiosResponse<AuthResponse>> => {
    const response = await axiosInstance.post<AuthResponse>("/Auth/login", payload);
    return response;
};

export const forgotPassword = async (email: string): Promise<AxiosResponse<any>> => {
    const response = await axiosInstance.post<any>("/Auth/forgot-password", { email });
    return response;
};

export interface ResetPasswordPayload {
    token: string;
    newPassword: string;
}

export const resetPassword = async (payload: ResetPasswordPayload): Promise<AxiosResponse<any>> => {
    const response = await axiosInstance.post<any>("/Auth/reset-password", payload);
    return response;
};
