import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { NavbarUser } from '../../components/layout/Navbar';
import { NavItem, UserRole, ParentUserProfile } from '../../types';
import { Icons } from '../../constants';
import ParentOverviewContent from './ParentOverviewContent';
import MinimalFeaturePage from '../shared/MinimalFeaturePage';
import ParentChildrenPage from './ParentChildrenPage';
import ParentChildAttendancePage from './ParentChildAttendancePage';
import ParentChildGradesPage from './ParentChildGradesPage';
import ParentFeesPage from './ParentFeesPage';
import { mockParentProfiles } from '../../services/mockData';

interface ParentDashboardProps {
  user: NavbarUser;
  onSignOut: () => void;
}

const parentNavItems: NavItem[] = [
  { name: 'Overview', path: 'overview', icon: <Icons.Dashboard className="w-5 h-5"/> },
  { name: 'My Children', path: 'children', icon: <Icons.Students className="w-5 h-5"/> },
  { name: 'Attendance', path: 'attendance', icon: <Icons.Attendance className="w-5 h-5"/> },
  { name: 'Grades', path: 'grades', icon: <Icons.Grades className="w-5 h-5"/> },
  { name: 'Fees', path: 'fees', icon: <Icons.Fees className="w-5 h-5"/> },
  { name: 'Announcements', path: 'announcements', icon: <Icons.Communication className="w-5 h-5"/> },
  { name: 'Events', path: 'events', icon: <Icons.Events className="w-5 h-5"/> },
  { name: 'Settings', path: 'settings', icon: <Icons.Cog className="w-5 h-5"/> },
];

const ParentDashboard: React.FC<ParentDashboardProps> = ({ user, onSignOut }) => {
  const parentProfile = mockParentProfiles.find(p => p.name === user.name) || mockParentProfiles[0];

  return (
    <DashboardLayout user={user} navItems={parentNavItems} currentRole={UserRole.PARENT} onSignOut={onSignOut}>
      <Routes>
        <Route path="overview" element={<ParentOverviewContent parentId={parentProfile.id} />} />
        <Route path="children" element={<ParentChildrenPage parentId={parentProfile.id} />} />
        <Route path="attendance" element={<ParentChildAttendancePage parentId={parentProfile.id} />} />
        <Route path="grades" element={<ParentChildGradesPage parentId={parentProfile.id} />} />
        <Route path="fees" element={<ParentFeesPage parentId={parentProfile.id} />} />
        <Route path="announcements" element={<MinimalFeaturePage title="School Announcements" description="Stay updated with the latest news and announcements from the school." icon={<Icons.Communication className="w-16 h-16 text-gray-400 dark:text-gray-500 hc-text-secondary" />} />} />
        <Route path="events" element={<MinimalFeaturePage title="School Events for Parents" description="View upcoming parent-teacher meetings, workshops, and other school events." icon={<Icons.Events className="w-16 h-16 text-gray-400 dark:text-gray-500 hc-text-secondary" />} />} />
        <Route path="settings" element={<MinimalFeaturePage title="Parent Settings" description="Manage your contact information, notification preferences, and linked children's profiles." icon={<Icons.Cog className="w-16 h-16 text-gray-400 dark:text-gray-500 hc-text-secondary" />} />} />
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default ParentDashboard;