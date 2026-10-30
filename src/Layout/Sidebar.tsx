import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router";
import { useAppSelector } from "../redux-store/hooks";

interface MenuChild {
    label: string;
    path: string;
    roles?: string[];
}

interface MenuItem {
    label: string;
    icon: React.ReactNode;
    children?: MenuChild[];
    path?: string;
    section?: string;
    roles?: string[];
}

interface Props {
    isCollapsed: boolean;
    menu: MenuItem[];
}

const SidebarMenu: React.FC<Props> = ({ isCollapsed, menu }) => {
    const userDetails = useAppSelector(
        (state) => state.auth.userDetails
    );

    const [tooltip, setTooltip] = useState<{
        label: string;
        top: number;
        left: number;
    } | null>(null);

    const location = useLocation();

    // Get the logged-in user's roles.
    const userRoles = userDetails?.roleNames ?? [];

    // Check whether the logged-in user has permission.
    const isAllowed = (roles?: string[]): boolean => {
        if (!roles || roles.length === 0) {
            return true;
        }

        return roles.some((role) => userRoles.includes(role));
    };

    // Check whether the current route matches a menu path.
    const checkIsActive = (
        itemPath?: string,
        currentPath?: string
    ): boolean => {
        if (!itemPath || !currentPath) {
            return false;
        }

        if (itemPath === "/") {
            return currentPath === "/";
        }

        return (
            currentPath === itemPath ||
            currentPath.startsWith(`${itemPath}/`)
        );
    };

    // Check parent menu and child menu active status.
    const isMenuActive = (item: MenuItem): boolean => {
        if (checkIsActive(item.path, location.pathname)) {
            return true;
        }

        return (
            item.children?.some((child) =>
                checkIsActive(child.path, location.pathname)
            ) ?? false
        );
    };

    // Show tooltip when sidebar is collapsed.
    const showTooltip = (
        label: string,
        element: HTMLElement
    ) => {
        if (!isCollapsed) {
            return;
        }

        const rect = element.getBoundingClientRect();

        setTooltip({
            label,
            top: rect.top + rect.height / 2,
            left: rect.right + 12,
        });
    };

    // Filter menus based on user roles.
    const allowedMenus = menu
        .filter((item) => isAllowed(item.roles))
        .map((item) => ({
            ...item,
            children: item.children?.filter((child) =>
                isAllowed(child.roles)
            ),
        }));

    return (
        <nav className="mt-1 px-2">
            {allowedMenus.map((item, index) => {
                const isActive = isMenuActive(item);

                return (
                    <div key={`${item.label}-${index}`}>
                        {/* Section Heading */}
                        {item.section && !isCollapsed && (
                            <div className="mt-6 px-3 text-xs font-bold text-gray-400">
                                {item.section}
                            </div>
                        )}

                        {/* Parent Menu */}
                        <div
                            className={`flex items-center w-full py-2.5 transition-colors ${
                                isCollapsed
                                    ? "justify-center px-1"
                                    : "px-2"
                            } ${
                                isActive
                                    ? "bg-[#23385c] font-bold text-[#03BE63] border-l-4 border-[#03BE63]"
                                    : "hover:bg-[#23385c]/50 text-white"
                            }`}
                        >
                            {item.path ? (
                                <Link
                                    to={item.path}
                                    aria-label={
                                        isCollapsed
                                            ? item.label
                                            : undefined
                                    }
                                    onMouseEnter={(event) =>
                                        showTooltip(
                                            item.label,
                                            event.currentTarget
                                        )
                                    }
                                    onMouseLeave={() =>
                                        setTooltip(null)
                                    }
                                    onFocus={(event) =>
                                        showTooltip(
                                            item.label,
                                            event.currentTarget
                                        )
                                    }
                                    onBlur={() =>
                                        setTooltip(null)
                                    }
                                    className={`flex items-center w-full ${
                                        isCollapsed
                                            ? "justify-center"
                                            : "space-x-3"
                                    }`}
                                >
                                    <span className="flex-shrink-0">
                                        {item.icon}
                                    </span>

                                    {!isCollapsed && (
                                        <span className="text-sm truncate">
                                            {item.label}
                                        </span>
                                    )}
                                </Link>
                            ) : (
                                <div
                                    className={`flex items-center w-full ${
                                        isCollapsed
                                            ? "justify-center"
                                            : "space-x-3"
                                    }`}
                                >
                                    <span className="flex-shrink-0">
                                        {item.icon}
                                    </span>

                                    {!isCollapsed && (
                                        <span className="text-sm truncate">
                                            {item.label}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Child Menus */}
                        {!isCollapsed &&
                            item.children &&
                            item.children.length > 0 && (
                                <ul className="ml-8 mt-1 space-y-1 text-sm text-gray-300">
                                    {item.children.map(
                                        (sub, childIndex) => {
                                            const isChildActive =
                                                location.pathname ===
                                                sub.path;

                                            return (
                                                <li
                                                    key={`${sub.path}-${childIndex}`}
                                                >
                                                    <Link
                                                        to={sub.path}
                                                        className={`block py-1.5 px-2 rounded hover:text-[#03BE63] ${
                                                            isChildActive
                                                                ? "text-[#03BE63] font-semibold bg-[#23385c]/30"
                                                                : ""
                                                        }`}
                                                    >
                                                        {sub.label}
                                                    </Link>
                                                </li>
                                            );
                                        }
                                    )}
                                </ul>
                            )}
                    </div>
                );
            })}

            {/* Collapsed Sidebar Tooltip */}
            {isCollapsed &&
                tooltip &&
                createPortal(
                    <div
                        role="tooltip"
                        className="pointer-events-none fixed z-[100] -translate-y-1/2 whitespace-nowrap rounded-md bg-white px-3 py-2 text-xs font-medium text-gray-800 shadow-lg ring-1 ring-black/10"
                        style={{
                            top: tooltip.top,
                            left: tooltip.left,
                        }}
                    >
                        <span
                            aria-hidden="true"
                            className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-white"
                        />

                        <span className="relative">
                            {tooltip.label}
                        </span>
                    </div>,
                    document.body
                )}
        </nav>
    );
};

export default SidebarMenu;