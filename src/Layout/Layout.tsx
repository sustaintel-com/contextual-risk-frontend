

//import { useTranslation } from "react-i18next";
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
    PanelLeftClose,
    PanelLeftOpen,
    X,
} from "lucide-react";
import LanguageDialog from "../components/dialogs/LanguageChangeDialog";

const Layout: React.FC = () => {
    const menuData = useMenuData();
    //const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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

    const toggleMobileSidebar = () => {
        setIsMobileOpen((previous) => !previous);
    };

    const toggleDesktopSidebar = () => {
        setIsSidebarCollapsed((previous) => !previous);
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
    const renderUserMenu = (mobile = false) => (
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
                        className={`absolute z-50 w-56 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white text-gray-800 shadow-xl ${mobile ? "bottom-full left-2 mb-2 max-h-[45vh] overflow-y-auto" : "bottom-2 left-full ml-3"}`}
                    >
                        {!mobile && <span aria-hidden="true" className="absolute -left-2 bottom-5 h-3 w-3 rotate-45 border-b border-l border-gray-200 bg-white" />}
                        {/* Profile details */}
                        <div className="relative rounded-t-xl border-b border-gray-200 bg-gray-50 p-4">
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
        <div className="flex h-dvh min-h-0 overflow-hidden bg-gray-100">
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
                    className={`bg-[#0B234A] text-white fixed inset-y-0 left-0
                               z-40 border-r border-gray-800 flex flex-col
                               justify-between transition-[width] duration-300
                               ${isSidebarCollapsed ? "w-16" : "w-64"}`}
                >
                    {!isSidebarCollapsed && (
                        <button
                            type="button"
                            onClick={toggleDesktopSidebar}
                            aria-label="Collapse sidebar"
                            title="Collapse sidebar"
                            className="absolute right-1 top-4 z-[70] flex h-8 w-8 translate-x-1/2 items-center justify-center  border border-gray-300 bg-white text-[#0B234A] shadow-md transition-colors hover:bg-gray-100"
                        >
                            <PanelLeftClose size={17} />
                        </button>
                    )}
                    {/* Sidebar top */}
                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                        <div
                            className={`flex shrink-0 items-center shadow-sm border-b p-2 border-gray-700 ${isSidebarCollapsed ? "justify-center" : ""}`}
                        >
                            {isSidebarCollapsed && (
                                <button
                                    type="button"
                                    onClick={toggleDesktopSidebar}
                                    aria-label="Expand sidebar"
                                    title="Expand sidebar"
                                    className="rounded-md p-2 text-gray-200 hover:bg-[#23385c] hover:text-white"
                                >
                                    <PanelLeftOpen size={20} />
                                </button>
                            )}
                            <img
                                src={logo}
                                alt="Contextual Risk Radar Logo"
                                className={`${isSidebarCollapsed ? "hidden" : "min-w-0 flex-1 h-auto"} rounded-lg bg-white`}
                            />
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-visible">
                            <SidebarMenu
                                isCollapsed={isSidebarCollapsed}
                                menu={menuData}
                            />
                        </div>
                    </div>

                    {/* Sidebar bottom */}
                    <div className="shrink-0 border-t border-gray-700">
                        {isSidebarCollapsed ? (
                            <div ref={triggerRef} className="relative flex flex-col items-center gap-2 p-2">
                                <button type="button" onClick={toggleUserMenu} aria-expanded={userMenuOpen} aria-haspopup="true" aria-label="Open user menu" title={userDetails?.user?.username ?? "User"} className="rounded-md p-2 hover:bg-[#23385c]">
                                    <img src={userImg} alt="" className="h-8 w-8 rounded-full object-cover" />
                                </button>
                                {userMenuOpen && (
                                    <div role="menu" className="absolute bottom-2 left-full z-50 ml-3 w-56 rounded-xl border border-gray-200 bg-white text-gray-800 shadow-xl">
                                        <span aria-hidden="true" className="absolute -left-2 bottom-5 h-3 w-3 rotate-45 border-b border-l border-gray-200 bg-white" />
                                        <div className="relative rounded-t-xl border-b border-gray-200 bg-gray-50 p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#144271]">
                                                    <UserRound size={22} className="text-white" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold">{userDetails?.user?.username ?? "User"}</p>
                                                    <p className="mt-1 text-xs text-gray-500">{userDetails?.user?.roleNames?.[0] ?? "User"}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button type="button" role="menuitem" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-b-xl px-4 py-3 text-left text-sm text-red-600 transition-colors hover:bg-red-50">
                                            <LogOut size={18} />
                                            <span className="font-medium">Logout</span>
                                        </button>
                                    </div>
                                )}
                                <img src={newLogo} alt="Company Logo" className="w-9 object-contain" />
                            </div>
                        ) : renderUserMenu()}
                    </div>
                </aside>
            )}

            {/* Mobile sidebar */}
            {isMobile && isMobileOpen && (
                    <aside
                    className="fixed inset-y-0 left-0 z-40 flex w-[min(18rem,88vw)] max-w-[88vw] flex-col justify-between overflow-visible bg-[#0B234A] text-white shadow-xl"
                >
                    {/* Sidebar top */}
                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                        <div
                            className="flex shrink-0 items-center border-b border-gray-700 p-2 pl-14 shadow-sm"
                        >
                            <img
                                src={logo}
                                alt="Contextual Risk Radar Logo"
                                className="max-h-14 w-full rounded-lg bg-white object-contain"
                            />
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto">
                            <SidebarMenu isCollapsed={false} menu={menuData} />
                        </div>
                    </div>

                    {/* Sidebar bottom */}
                    <div className="shrink-0 border-t border-gray-700">
                        {renderUserMenu(true)}
                    </div>
                </aside>
            )}

            {/* Mobile sidebar toggle */}
            {isMobile && (
                <button
                    type="button"
                    onClick={toggleMobileSidebar}
                    className="fixed top-2 left-2 z-50 p-2
                               rounded bg-[#0B2D55] text-white
                               shadow-md md:hidden"
                    aria-label={isMobileOpen ? "Close sidebar" : "Open sidebar"}
                >
                    {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            )}

            {/* Main content */}
            <div
                className={`flex-1 overflow-hidden w-full h-full
                            flex flex-col transition-all duration-300 ${
                                !isMobile ? (isSidebarCollapsed ? "md:ml-16" : "md:ml-64") : ""
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
