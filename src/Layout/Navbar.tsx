import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux-store/hooks';
import { useSnackbar } from '../Context/SnackbarContext';
import { logout } from '../redux-store/Slises/authSlice';
import { CircleUserRound, LogOut, Menu, User, UserShield } from 'lucide-react';

interface Props {
  toggleSidebar: () => void;
  isCollapsed: boolean;
  isMobile: boolean
}

const Navbar: React.FC<Props> = ({ toggleSidebar, isCollapsed, isMobile }) => {
  const { showSnackbar } = useSnackbar();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const userDetails = useAppSelector((state) => state.auth.userDetails)
  const dispatch = useAppDispatch()
  const togglePopover = () => {
    setIsPopoverOpen(!isPopoverOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    showSnackbar("Logout successful!", { type: "success", duration: 3000 });
  };

  return (
    <div
      className={`fixed top-0 right-0 z-20 transition-all duration-300 ${!isMobile ? (isCollapsed ? 'md:left-16 ' : 'md:left-64') : 'left-0'
        }`}
    >
      <div className="bg-white px-4 py-3 h-14 shadow-sm font-semibold text-gray-700 flex items-center justify-between md:justify-start">
        <button
          className="md:hidden mr-4 p-2 rounded hover:bg-gray-200"
          onClick={toggleSidebar}
        >
          <Menu />
        </button>
        <span className='ms-4' hidden={!isCollapsed}>Contextual risk</span>

        {/* User Icon and Popover */}
        <div className="relative ml-auto">
          <button
            className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
            onClick={togglePopover}
            aria-expanded={isPopoverOpen}
            aria-haspopup="true"
            id="user-menu-button"
          >
            <CircleUserRound className="w-6 h-6 text-gray-700"/>
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
              <div className="flex flex-col px-2 py-2 text-gray-800" role="menuitem">
                <div className='flex'>
                  <User className="mr-2" />
                  <span className="font-semibold text-sm">{userDetails?.username}</span>
                </div>
                <div className='flex'>
                  <UserShield className="mr-2 ms-1 text-xs"/>
                  <span className="font-mono text-xs">{userDetails?.role}</span>
                </div>
              </div>
              <hr className="my-1 border-gray-200" />
              <button
                type='button'
                className="flex items-center w-full px-2 py-2 text-red-600 hover:bg-gray-100 focus:outline-none"
                onClick={() => handleLogout()}
              >
                <LogOut className="mr-2" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

  );
};

export default Navbar;