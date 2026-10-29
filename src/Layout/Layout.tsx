

import { useTranslation } from "react-i18next";
import useMenuData from "./MenuList";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux-store/hooks";
import { useSnackbar } from "../Context/SnackbarContext";
import { logout } from "../redux-store/Slises/authSlice";
import userImg from "../assets/user_icon.png";
import newLogo from "../assets/icons/EBS-new-logo.png";
import logo from "../assets/icons/Contextual Risk Radar Logo.png";
import SidebarMenu from "./Sidebar";
import {
    Menu,
    LogOut,
    UserRound,
    ChevronRight,
} from "lucide-react";
import LanguageDialog from "../components/dialogs/LanguageChangeDialog";

const Layout: React.FC = () => {
    const menuData = useMenuData();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(
        window.innerWidth < 768
    );
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const triggerRef = useRef<HTMLDivElement>(null);

    const userDetails = useAppSelector(
        (state) => state.auth.userDetails
    );

    const dispatch = useAppDispatch();
    const { showSnackbar } = useSnackbar();

    // Handle screen resizing
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);

            if (window.innerWidth >= 768) {
                setIsMobileOpen(false);
            }

            setUserMenuOpen(false);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Close the user popover when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            if (
                triggerRef.current &&
                !triggerRef.current.contains(target)
            ) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    // Close popovers and mobile sidebar when navigating
    useEffect(() => {
        setUserMenuOpen(false);
        setIsMobileOpen(false);
    }, [location.pathname]);

    const toggleSidebar = () => {
        setIsMobileOpen((previous) => !previous);
    };

    const toggleUserMenu = () => {
        setUserMenuOpen((previous) => !previous);
    };

    // Logout
    const handleLogout = () => {
        dispatch(logout());
        setUserMenuOpen(false);
        setIsMobileOpen(false);

        showSnackbar("Logout successful!", {
            type: "success",
            duration: 3000,
        });

        navigate("/login", { replace: true });
    };

    // User profile and popover
    const renderUserMenu = () => (
        <div className="relative p-1">
            {/* User profile trigger */}
            <div
                ref={triggerRef}
                className="relative"
            >
                <button
                    type="button"
                    onClick={toggleUserMenu}
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                    className="w-full p-2 m-0 rounded-lg flex items-center
                               gap-3 cursor-pointer bg-[#144271]
                               hover:bg-[#225f9c] transition-colors
                               text-left"
                >
                    <img
                        src={userImg}
                        alt="User"
                        className="w-8 h-8 rounded-full border
                                   border-gray-400 object-cover p-1"
                    />

                    <div className="flex-1 min-w-0">
                        <p
                            className="text-sm font-semibold text-white truncate"
                            title={userDetails?.user?.username ?? "User"}
                        >
                            {userDetails?.user?.username ?? "User"}
                        </p>

                        <p className="text-xs text-gray-300 truncate">
                            {userDetails?.user?.roleNames?.[0] ?? "User"}
                        </p>
                    </div>

                    <ChevronRight
                        size={16}
                        className={`text-gray-300 transition-transform ${
                            userMenuOpen ? "rotate-90" : ""
                        }`}
                    />
                </button>

                {/* User details popover */}
                {userMenuOpen && (
                    <div
                        id="user-dropdown-portal"
                        role="menu"
                        className="absolute bottom-full left-0 right-0 mb-2
                                   bg-white rounded-xl shadow-xl
                                   border border-gray-200 overflow-hidden
                                   z-50 text-gray-800"
                    >
                        {/* Profile details */}
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 shrink-0 rounded-full
                                               bg-[#144271] flex items-center
                                               justify-center"
                                >
                                    <UserRound
                                        size={22}
                                        className="text-white"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p
                                        className="font-semibold text-sm truncate"
                                        title={
                                            userDetails?.user?.username ?? "User"
                                        }
                                    >
                                        {userDetails?.user?.username ?? "User"}
                                    </p>

                                    <p className="text-xs text-gray-500 mt-1">
                                        {userDetails?.user?.roleNames?.[0] ??
                                            "User"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Logout button */}
                        <button
                            type="button"
                            role="menuitem"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3
                                       px-4 py-3 text-sm text-red-600
                                       hover:bg-red-50 transition-colors
                                       text-left"
                        >
                            <LogOut size={18} />
                            <span className="font-medium">
                                Logout
                            </span>
                        </button>
                    </div>
                )}
            </div>

            {/* Bottom logo */}
            <div className="p-2 mt-1">
                <img
                    src={newLogo}
                    alt="Company Logo"
                    className="w-full h-auto object-contain"
                />
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Mobile overlay */}
            {isMobile && isMobileOpen && (
                <div
                    onClick={() => setIsMobileOpen(false)}
                    className="fixed inset-0 bg-black/40 z-30 md:hidden"
                />
            )}

            {/* Desktop sidebar */}
            {!isMobile && (
                <aside
                    className="bg-[#0B234A] text-white w-50 fixed
                               z-40 h-full border-r border-gray-800
                               flex flex-col justify-between"
                >
                    {/* Sidebar top */}
                    <div className="min-h-0 flex-1 overflow-y-auto">
                        <div
                            className="flex items-center shadow-sm
                                       border-b p-2 border-gray-700"
                        >
                            <img
                                src={logo}
                                alt="Contextual Risk Radar Logo"
                                className="w-full h-auto rounded-lg bg-white"
                            />
                        </div>

                        <SidebarMenu
                            isCollapsed={false}
                            menu={menuData}
                        />
                    </div>

                    {/* Sidebar bottom */}
                    <div className="shrink-0 border-t border-gray-700">
                        {renderUserMenu()}
                    </div>
                </aside>
            )}

            {/* Mobile sidebar */}
            {isMobile && isMobileOpen && (
                <aside
                    className="fixed inset-y-0 left-0 w-50
                               bg-[#0B234A] text-white z-40
                               shadow-md flex flex-col justify-between"
                >
                    {/* Sidebar top */}
                    <div className="min-h-0 flex-1 overflow-y-auto">
                        <div
                            className="flex items-center shadow-sm
                                       border-b border-gray-700 p-2"
                        >
                            <img
                                src={logo}
                                alt="Contextual Risk Radar Logo"
                                className="w-full h-auto rounded-lg bg-white"
                            />
                        </div>

                        <SidebarMenu
                            isCollapsed={false}
                            menu={menuData}
                        />
                    </div>

                    {/* Sidebar bottom */}
                    <div className="shrink-0 border-t border-gray-700">
                        {renderUserMenu()}
                    </div>
                </aside>
            )}

            {/* Mobile sidebar toggle */}
            {isMobile && (
                <button
                    type="button"
                    onClick={toggleSidebar}
                    className="fixed top-2 left-2 z-50 p-2
                               rounded bg-[#0B2D55] text-white
                               shadow-md md:hidden"
                    aria-label="Toggle Sidebar"
                >
                    <Menu size={22} />
                </button>
            )}

            {/* Main content */}
            <div
                className={`flex-1 overflow-hidden w-full h-full
                            flex flex-col transition-all duration-300 ${
                                !isMobile ? "md:ml-50" : ""
                            }`}
            >
                <div
                    className="flex-1 overflow-hidden border-4
                               border-[#0B234A] grid grid-cols-1
                               shadow-sm bg-white"
                >
                    <div className="h-full overflow-y-auto">
                        <Outlet />
                    </div>
                </div>
            </div>

            {/* Language dialog */}
            <LanguageDialog
                isOpen={isDialogOpen}
                onClose={() => setDialogOpen(false)}
            />
        </div>
    );
};

export default Layout;