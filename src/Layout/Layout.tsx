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
import { Menu } from "lucide-react";
import LanguageDialog from "../components/dialogs/LanguageChangeDialog";


const Layout: React.FC = () => {
    const menuData = useMenuData();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const userDetails = useAppSelector((state) => state.auth.userDetails)
    const dispatch = useAppDispatch()
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsMobileOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            const clickedTrigger = triggerRef.current?.contains(target);
            const clickedPortal = (target as HTMLElement).closest?.("#user-dropdown-portal");
            if (!clickedTrigger && !clickedPortal) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    useEffect(() => {
        if (!userMenuOpen) return;
        const reposition = () => {
            if (triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                setMenuPos({
                    top: rect.top + rect.height / 2,
                    left: rect.right + 8,
                });
            }
        };
        reposition();
        window.addEventListener("resize", reposition);
        window.addEventListener("scroll", reposition, true);
        return () => {
            window.removeEventListener("resize", reposition);
            window.removeEventListener("scroll", reposition, true);
        };
    }, [userMenuOpen]);

    const toggleSidebar = () => setIsMobileOpen(!isMobileOpen);

    const toggleUserMenu = () => {
        if (!userMenuOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setMenuPos({
                top: rect.top + rect.height / 2,
                left: rect.right + 8,
            });
        }
        setUserMenuOpen((prev) => !prev);
    };

    const handleLogout = () => {
        dispatch(logout());
        showSnackbar("Logout successful!", { type: "success", duration: 3000 });
        setUserMenuOpen(false);
    };

    const renderUserMenu = () => (
        <div className="relative">
            <div ref={triggerRef} className="relative">
                <div
                    onClick={toggleUserMenu}
                    className="p-2 m-2 rounded-lg flex items-center space-x-3 cursor-pointer bg-[#144271] hover:bg-[#225f9c]"
                >
                    <img
                        src={userImg}
                        alt="User"
                        className="w-8 h-8 rounded-full border border-gray-500 object-center p-2"
                    />
                    <div className="truncate" title={userDetails?.username}>
                        <p className="text-sm font-semibold text-white truncate">
                            {userDetails?.username}
                        </p>
                        <p className="text-xs text-gray-300 truncate">{userDetails?.role}</p>
                    </div>
                </div>
            </div>

            <div className="p-2">
                <img src={newLogo} alt="" />
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Overlay on mobile */}
            {isMobileOpen && (
                <div
                    onClick={() => setIsMobileOpen(false)}
                    className="fixed inset-0 bg-opacity-40 z-30 md:hidden"
                />
            )}

            {/* Desktop Sidebar */}
            {!isMobile && (
                <aside className="bg-[#0B234A] text-white w-50 fixed z-40 h-full border-r border-gray-800 flex flex-col justify-between">
                    {/* Top section */}
                    <div>
                        <div className="flex items-center shadow-sm border-b p-2 border-gray-700">
                            <img
                                src={logo}
                                alt="Logo"
                                className="w-full h-auto rounded-lg"
                            />
                        </div>
                        <SidebarMenu isCollapsed={false} menu={menuData} />
                    </div>

                    {/* Bottom user menu */}
                    {renderUserMenu()}
                </aside>
            )}

            {/* Mobile Sidebar */}
            {isMobile && isMobileOpen && (
                <aside className="fixed inset-y-0 left-0 w-50 bg-[#0B234A] text-white z-40 shadow-md flex flex-col justify-between">
                    {/* Top section */}
                    <div>

                        <div className="flex items-center shadow-sm border-b border-gray-700">
                            <img
                                src={logo}
                                alt="Logo"
                                className="w-full h-full rounded-lg p-2"
                            />
                        </div>
                        <SidebarMenu isCollapsed={false} menu={menuData} />
                    </div>

                    {/* Bottom user menu */}
                    {renderUserMenu()}
                </aside>
            )}

            {/* Floating toggle button on mobile */}
            {isMobile && (
                <button
                    onClick={toggleSidebar}
                    className="fixed top-2 left-2 z-50 p-1 rounded bg-[#0b2d55] text-white shadow-md md:hidden"
                    aria-label="Toggle Sidebar"
                >
                    <Menu />
                </button>
            )}

            {/* Main Content */}
            <div
                className={`flex-1 overflow-hidden w-full h-full flex flex-col transition-all duration-300 ${!isMobile ? "md:ml-50" : ""
                    }`}
            >
                {/* Fixed border wrapper */}
                <div className="flex-1  overflow-hidden border-4 border-[#0B234A] grid grid-cols-1 shadow-sm bg-white">
                    {/* Scrollable content only */}
                    <div className="h-full overflow-y-auto">
                        <Outlet />
                    </div>
                </div>
            </div>
            <LanguageDialog
                isOpen={isDialogOpen}
                onClose={() => setDialogOpen(false)}
            />
        </div>
    );
};

export default Layout;