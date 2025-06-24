import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { NavbarUser } from '../../components/layout/Navbar';
import { NavItem, UserRole } from '../../types';
import { Icons } from '../../constants';
import AdminOverviewContent from './AdminOverviewContent';
import AdminSubscriptionRevenuePage from './AdminSubscriptionRevenuePage';
import AdminStudentsPage from './AdminStudentsPage';
import AdminTeachersPage from './AdminTeachersPage';
import AdminClassesPage from './AdminClassesPage';
import AdminFeesPage from './AdminFeesPage';
import MinimalFeaturePage from '../shared/MinimalFeaturePage';
import AdminEventsPage from './AdminEventsPage';

interface AdminDashboardProps {
  user: NavbarUser;
  onSignOut: () => void;
}

const adminNavItems: NavItem[] = [
  { name: 'Overview', path: 'overview', icon: <Icons.Dashboard className="w-5 h-5"/> },
  { name: 'Students', path: 'students', icon: <Icons.Students className="w-5 h-5"/> },
  { name: 'Teachers', path: 'teachers', icon: <Icons.Teachers className="w-5 h-5"/> },
  { name: 'Classes', path: 'classes', icon: <Icons.Classes className="w-5 h-5"/> },
  { name: 'Fees', path: 'fees', icon: <Icons.Fees className="w-5 h-5"/> },
  { name: 'Billing', path: 'billing', icon: <Icons.Billing className="w-5 h-5"/> },
  { name: 'Events', path: 'events', icon: <Icons.Events className="w-5 h-5"/> },
  { name: 'Communication', path: 'communication', icon: <Icons.Communication className="w-5 h-5"/> },
  { name: 'Reports', path: 'reports', icon: <Icons.Reports className="w-5 h-5"/> },
  { name: 'Settings', path: 'settings', icon: <Icons.Cog className="w-5 h-5"/> },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onSignOut }) => {
  return (
    <DashboardLayout user={user} navItems={adminNavItems} currentRole={UserRole.ADMIN} onSignOut={onSignOut}>
      <Routes>
        <Route path="overview" element={<AdminOverviewContent />} />
        <Route path="students" element={<AdminStudentsPage />} />
        <Route path="teachers" element={<AdminTeachersPage />} />
        <Route path="classes" element={<AdminClassesPage />} />
        <Route path="fees" element={<AdminFeesPage />} />
        <Route path="billing" element={<AdminSubscriptionRevenuePage />} />
        <Route path="events" element={<AdminEventsPage />} />
        <Route path="communication" element={<MinimalFeaturePage title="Communication Center" description="Manage school-wide announcements, and direct messaging features will be available here." icon={<Icons.Communication className="w-16 h-16 text-gray-400 dark:text-gray-500 hc-text-secondary" />} />} />
        <Route path="reports" element={<MinimalFeaturePage title="Analytics & Reports" description="View attendance trends, fee collection status, student performance heatmaps, and class-wise comparison charts." icon={<Icons.Reports className="w-16 h-16 text-gray-400 dark:text-gray-500 hc-text-secondary" />} />} />
        <Route path="settings" element={<MinimalFeaturePage title="Admin Settings" description="Configure general school settings, academic year details, and other system preferences." icon={<Icons.Cog className="w-16 h-16 text-gray-400 dark:text-gray-500 hc-text-secondary" />} />} />
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;