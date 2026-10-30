import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../redux-store/hooks";
import { useSnackbar } from "../Context/SnackbarContext";
import { logout } from "../redux-store/Slises/authSlice";
import { userLogout } from "../Pages/Login/Services/AuthService";
import {
    CircleUserRound,
    LogOut,
    Menu,
    User,
    UserShield,
} from "lucide-react";

interface Props {
    toggleSidebar: () => void;
    isCollapsed: boolean;
    isMobile: boolean;
}

const Navbar: React.FC<Props> = ({
    toggleSidebar,
    isCollapsed,
    isMobile,
}) => {
    const { showSnackbar } = useSnackbar();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const userDetails = useAppSelector(
        (state) => state.auth.userDetails
    );

    const togglePopover = () => {
        setIsPopoverOpen((prev) => !prev);
    };

    const handleLogout = async () => {
        if (isLoggingOut) return;

        try {
            setIsLoggingOut(true);

            // Clear the authentication cookie from the backend.
            await userLogout();

            // Clear the Redux authentication state.
            dispatch(logout());

            setIsPopoverOpen(false);

            showSnackbar("Logout successful!", {
                type: "success",
                duration: 3000,
            });

            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout error:", error);

            // Clear local authentication state even if the API request fails.
            dispatch(logout());

            setIsPopoverOpen(false);

            showSnackbar(
                "Unable to confirm logout with the server. Please try again.",
                {
                    type: "error",
                    duration: 3000,
                }
            );

            navigate("/login", { replace: true });
        } finally {
            setIsLoggingOut(false);
        }
    };

    const username = userDetails?.username ?? "User";
    const roles = userDetails?.roleNames?.join(", ") || "User";

    return (
        <div
            className={`fixed top-0 right-0 z-20 transition-all duration-300 ${
                !isMobile
                    ? isCollapsed
                        ? "md:left-16"
                        : "md:left-64"
                    : "left-0"
            }`}
        >
            <div className="bg-white px-4 py-3 h-14 shadow-sm font-semibold text-gray-700 flex items-center justify-between md:justify-start">

                {/* Mobile Sidebar Toggle */}
                <button
                    type="button"
                    className="md:hidden mr-4 p-2 rounded hover:bg-gray-200"
                    onClick={toggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    <Menu />
                </button>

                {/* Application Name */}
                <span
                    className="ms-4"
                    hidden={!isCollapsed}
                >
                    Contextual Risk
                </span>

                {/* User Profile Popover */}
                <div className="relative ml-auto">

                    <button
                        type="button"
                        className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
                        onClick={togglePopover}
                        aria-expanded={isPopoverOpen}
                        aria-haspopup="true"
                        id="user-menu-button"
                        aria-label="User menu"
                    >
                        <CircleUserRound className="w-6 h-6 text-gray-700" />
                    </button>

                    {isPopoverOpen && (
                        <div
                            className="absolute right-0 mt-3 w-60 max-w-xs sm:max-w-sm md:w-60 bg-white rounded-md shadow-lg py-2 z-30
                            after:content-[''] after:absolute after:bottom-full after:right-4 after:border-8 after:border-transparent
                            after:border-b-white after:filter after:drop-shadow-[0_-1px_1px_rgba(0,0,0,0.1)]"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="user-menu-button"
                        >
                            {/* User Details */}
                            <div className="flex flex-col px-3 py-2 text-gray-800">
                                <div className="flex items-center">
                                    <User className="mr-2 w-4 h-4" />

                                    <span className="font-semibold text-sm">
                                        {username}
                                    </span>
                                </div>

                                <div className="flex items-center mt-2">
                                    <UserShield className="mr-2 ml-0.5 w-4 h-4 text-gray-500" />

                                    <span className="font-mono text-xs text-gray-500">
                                        {roles}
                                    </span>
                                </div>
                            </div>

                            <hr className="my-1 border-gray-200" />

                            {/* Logout */}
                            <button
                                type="button"
                                className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-gray-100 focus:outline-none disabled:opacity-50"
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                role="menuitem"
                            >
                                <LogOut className="mr-2 w-4 h-4" />

                                <span>
                                    {isLoggingOut
                                        ? "Logging out..."
                                        : "Logout"}
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;