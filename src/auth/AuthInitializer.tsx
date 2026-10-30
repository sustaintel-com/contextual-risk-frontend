import { useEffect, useState } from "react";

import { useAppDispatch } from "../redux-store/hooks";
import {
    setUser,
    logout,
    setAuthLoading,
} from "../redux-store/Slises/authSlice";

import { getCurrentUser } from "../Pages/Login/Services/AuthService";
import DashLoader from "../components/dash-loader/DashLoader";

interface Props {
    children: React.ReactNode;
}

const AuthInitializer: React.FC<Props> = ({ children }) => {
    const dispatch = useAppDispatch();
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        let mounted = true;

        const initializeAuth = async () => {
            try {
                dispatch(setAuthLoading(true));

                // Browser automatically sends the existing cookie.
                const response = await getCurrentUser();

                if (mounted && response.data?.user) {
                    dispatch(setUser(response.data.user));
                } else if (mounted) {
                    dispatch(logout());
                }
            } catch (error) {
                if (mounted) {
                    dispatch(logout());
                }
            } finally {
                if (mounted) {
                    setInitialized(true);
                }
            }
        };

        initializeAuth();

        return () => {
            mounted = false;
        };
    }, [dispatch]);

    if (!initialized) {
        return (
            <DashLoader
                isRunLoader={true}
                text="Checking authentication... Please wait."
            />
        );
    }

    return <>{children}</>;
};

export default AuthInitializer;