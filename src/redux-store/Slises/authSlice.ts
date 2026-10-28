import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponse, AuthState } from "../../Pages/Login/Services/AuthModel";


const initialState: AuthState = {
    isLoggedIn: false,
    userDetails: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<AuthResponse>) => {
            state.isLoggedIn = true;
            state.userDetails = action.payload;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.userDetails = null;
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
