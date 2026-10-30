
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router';
import { useAppSelector } from '../redux-store/hooks';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  children?: { label: string; path: string, roles?: string[] }[];
  path?: string;
  section?: string;
  roles?: string[]; // Make roles optional here
}

interface Props {
  isCollapsed: boolean;
  menu: MenuItem[];
}

const SidebarMenu: React.FC<Props> = ({ isCollapsed, menu }) => {
  const userDetails = useAppSelector((state) => state.auth.userDetails)
  //const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [tooltip, setTooltip] = useState<{ label: string; top: number; left: number } | null>(null);
  const location = useLocation();

  // const toggleMenu = (label: string) => {
  //   setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  // };

  const isAllowed = (roles?: string[]) =>
    !roles || roles.length === 0 ? true : !!userDetails?.role && roles.includes(userDetails.role);

  const checkIsActive = (itemPath?: string, currentPath?: string): boolean => {
    if (!itemPath || !currentPath) return false;
    if (itemPath === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(itemPath);
  };

  const showTooltip = (label: string, element: HTMLElement) => {
    if (!isCollapsed) return;
    const rect = element.getBoundingClientRect();
    setTooltip({ label, top: rect.top + rect.height / 2, left: rect.right + 12 });
  };

  return (
    <nav className="mt-1 px-2">
      {menu
        .filter(item => isAllowed(item.roles))
        .map((item, index) => (
          <div key={index}>
            {item.section && !isCollapsed && (
              <div className="mt-6 px-3 text-xs font-bold text-gray-400">
                {item.section}
              </div>
            )}

            <div
              className={`flex items-center w-full py-2.5 transition-colors ${isCollapsed ? "justify-center px-1" : "px-2"} ${
                checkIsActive(item.path, location.pathname) 
                  ? "bg-[#23385c] font-bold text-[#03BE63] border-l-4 border-[#03BE63]" 
                  : "hover:bg-[#23385c]/50 text-white"
              }`}
            >
              {item.path ? (
                <Link
                  to={item.path}
                  aria-label={isCollapsed ? item.label : undefined}
                  onMouseEnter={(event) => showTooltip(item.label, event.currentTarget)}
                  onMouseLeave={() => setTooltip(null)}
                  onFocus={(event) => showTooltip(item.label, event.currentTarget)}
                  onBlur={() => setTooltip(null)}
                  className={`flex items-center w-full ${isCollapsed ? "justify-center" : "space-x-3"}`}
                >
                  <span className="flex-shrink-0">
                    {item.icon}
                  </span>
                  {!isCollapsed && <span className="text-sm truncate">{item.label}</span>}
                </Link>
              ) : (
                <div className={`flex items-center w-full ${isCollapsed ? "justify-center" : "space-x-3"}`}>
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && <span className="text-sm truncate">{item.label}</span>}
                </div>
              )}
            </div>

            {!isCollapsed && item.children  && (
              <ul className="ml-8 mt-1 space-y-1 text-sm text-gray-300">
                {item.children
                  .filter(sub => isAllowed(sub.roles))
                  .map((sub, i) => (
                    <li key={i}>
                      <Link
                        to={sub.path}
                        className={`block py-1.5 px-2 rounded hover:text-[#03BE63] ${
                          location.pathname === sub.path ? "text-[#03BE63] font-semibold bg-[#23385c]/30" : ""
                        }`}
                      >
                        {sub.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        ))}
      {isCollapsed && tooltip && createPortal(
        <div role="tooltip" className="pointer-events-none fixed z-[100] -translate-y-1/2 whitespace-nowrap rounded-md bg-white px-3 py-2 text-xs font-medium text-gray-800 shadow-lg ring-1 ring-black/10" style={{ top: tooltip.top, left: tooltip.left }}>
          <span aria-hidden="true" className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-white" />
          <span className="relative">{tooltip.label}</span>
        </div>,
        document.body
      )}
    </nav>
  );
};

export default SidebarMenu;
