
export interface LoginFormInputs {
    username: string;
    password: string;
}

export interface User {
    id: number | string;
    fullName?: string;
    username: string;
    email?: string;
    roleNames: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthResponse {
    user: User;
}

export interface AuthState {
    userDetails: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
}

export interface ApiResponse<T> {
    user: T;
}
