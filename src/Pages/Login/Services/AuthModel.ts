export interface LoginFormInputs {
    email: string;
    password: string;
}

export interface User {
    fullName: string;
    username: string;
    password: string;
    id?: number;
    createdAt: string; 
    updatedAt: string; 
}

export interface AuthResponse {
    user?: User;
    token: string;
    username: string;
    role: string;
    id: number;
}

export interface AuthState {
    isLoggedIn: boolean;
    userDetails: AuthResponse | null;
}