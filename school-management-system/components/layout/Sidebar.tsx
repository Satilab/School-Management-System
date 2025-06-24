import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NavItem, UserRole } from '../../types';
import { Icons, APP_NAME } from '../../constants';

interface SidebarProps {
  navItems: NavItem[];
  currentRole: UserRole;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, currentRole, isOpen, setIsOpen }) => {
  const location = useLocation();

  const baseRolePath = `/${currentRole.toLowerCase()}`;

  const renderNavItems = (items: NavItem[], level = 0) => {
    return items.map((item) => {
      const fullPath = item.path.startsWith('/') ? item.path : `${baseRolePath}/${item.path}`;
      const isActive = location.pathname === fullPath || (item.children && location.pathname.startsWith(fullPath));
      
      return (
        <li key={item.name}>
          <NavLink
            to={fullPath}
            className={({ isActive: navIsActive }) => // Use NavLink's isActive
              `flex items-center p-2 text-base font-normal rounded-lg group transition-colors duration-150
              ${navIsActive 
                ? 'bg-academic-blue text-white dark:bg-blue-600 hc-button-primary' 
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white hc-text-primary hc-hover:bg-gray-700'}
              ${level > 0 ? 'pl-8' : ''}` 
            }
            onClick={() => setIsOpen(false)} 
          >
            {item.icon && React.cloneElement(item.icon as React.ReactElement<React.SVGProps<SVGSVGElement>>, { 
              className: `w-6 h-6 transition duration-75 
              ${isActive ? 'text-white dark:text-white hc-text-primary' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white hc-text-secondary hc-group-hover:text-primary'}` 
            })}
            <span className="ml-3 flex-1 whitespace-nowrap">{item.name}</span>
          </NavLink>
          {item.children && isActive && ( 
            <ul className="pl-4 mt-1 space-y-1">
              {renderNavItems(item.children, level + 1)}
            </ul>
          )}
        </li>
      );
    });
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black opacity-50 lg:hidden" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-y-0 flex-shrink-0 bg-white dark:bg-gray-800 shadow-xl hc-bg-secondary hc-border-primary border-r`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="flex items-center justify-between p-2 mb-4">
            <NavLink to={baseRolePath} className="flex items-center">
              <img src="https://picsum.photos/seed/logo/40/40" alt="App Logo" className="h-8 w-8 mr-2 rounded-full"/>
              <span className="self-center text-xl font-semibold whitespace-nowrap text-academic-blue-dark dark:text-academic-blue hc-text-primary">{APP_NAME}</span>
            </NavLink>
            <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hc-text-secondary">
                <Icons.Close className="w-6 h-6"/>
            </button>
          </div>
          <ul className="space-y-2">
            {renderNavItems(navItems)}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;