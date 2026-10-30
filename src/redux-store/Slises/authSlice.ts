
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "../../Pages/Login/Services/AuthModel";

const initialState: AuthState = {
    userDetails: null,
    isLoggedIn: false,
    isLoading: true,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<User>) => {
            state.userDetails = action.payload;
            state.isLoggedIn = true;
            state.isLoading = false;
        },

        logout: (state) => {
            state.userDetails = null;
            state.isLoggedIn = false;
            state.isLoading = false;
        },

        setUser: (state, action: PayloadAction<User>) => {
            state.userDetails = action.payload;
            state.isLoggedIn = true;
            state.isLoading = false;
        },

        setAuthLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

export const {
    login,
    logout,
    setUser,
    setAuthLoading,
} = authSlice.actions;

export default authSlice.reducer;
