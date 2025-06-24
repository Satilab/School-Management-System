import React, { useState } from 'react';
import Navbar, { NavbarUser } from './Navbar';
import Sidebar from './Sidebar';
import { NavItem, UserRole } from '../../types';
import { Icons } from '../../constants'; 

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: NavbarUser;
  navItems: NavItem[];
  currentRole: UserRole;
  onSignOut: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, user, navItems, currentRole, onSignOut }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 hc-bg-primary">
      <Sidebar navItems={navItems} currentRole={currentRole} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} onSignOut={onSignOut} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 md:p-6 lg:p-8 hc-bg-primary hc-text-primary">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;