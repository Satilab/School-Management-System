import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { NavbarUser } from '../../components/layout/Navbar';
import { NavItem, UserRole, Teacher } from '../../types';
import { Icons } from '../../constants';
import TeacherOverviewContent from './TeacherOverviewContent';
import TeacherAssignmentsPage from './TeacherAssignmentsPage'; 
import TeacherTimetablePage from './TeacherTimetablePage';
import { mockTeachers as allMockTeachers } from '../../services/mockData';
import TeacherMyClassesPage from './TeacherMyClassesPage';
import TeacherAttendancePage from './TeacherAttendancePage';
import TeacherGradesEntryPage from './TeacherGradesEntryPage';
import MinimalFeaturePage from '../shared/MinimalFeaturePage';


interface TeacherDashboardProps {
  user: NavbarUser;
  onSignOut: () => void;
}

const teacherNavItems: NavItem[] = [
  { name: 'Overview', path: 'overview', icon: <Icons.Dashboard className="w-5 h-5"/> },
  { name: 'My Classes', path: 'my-classes', icon: <Icons.Classes className="w-5 h-5"/> },
  { name: 'Timetable', path: 'timetable', icon: <Icons.Timetable className="w-5 h-5"/> },
  { name: 'Attendance', path: 'attendance', icon: <Icons.Attendance className="w-5 h-5"/> },
  { name: 'Assignments', path: 'assignments', icon: <Icons.Assignments className="w-5 h-5"/> },
  { name: 'Grades', path: 'grades', icon: <Icons.Grades className="w-5 h-5"/> },
  { name: 'Communication', path: 'communication', icon: <Icons.Communication className="w-5 h-5"/> },
  { name: 'Settings', path: 'settings', icon: <Icons.Cog className="w-5 h-5"/> },
];

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user, onSignOut }) => {
  const currentTeacher = allMockTeachers.find(t => t.name === user.name);
  const teacherId = currentTeacher?.id || 'T003'; 
  const teacherName = currentTeacher?.name || user.name;
  const assignedClasses = currentTeacher?.assignedClasses || [];

  return (
    <DashboardLayout user={user} navItems={teacherNavItems} currentRole={UserRole.TEACHER} onSignOut={onSignOut}>
      <Routes>
        <Route path="overview" element={<TeacherOverviewContent teacherId={teacherId} />} />
        <Route path="my-classes" element={<TeacherMyClassesPage teacherId={teacherId} />} />
        <Route path="timetable" element={<TeacherTimetablePage teacherId={teacherId} />} /> 
        <Route path="attendance" element={<TeacherAttendancePage teacherId={teacherId} assignedClasses={assignedClasses} />} />
        <Route path="assignments" element={<TeacherAssignmentsPage teacherId={teacherId} teacherName={teacherName} assignedClasses={assignedClasses} />} />
        <Route path="grades" element={<TeacherGradesEntryPage teacherId={teacherId} assignedClasses={assignedClasses} />} />
        <Route path="communication" element={<MinimalFeaturePage title="Teacher Communication Center" description="View announcements and manage messages with students and parents." icon={<Icons.Communication className="w-16 h-16 text-gray-400 dark:text-gray-500 hc-text-secondary" />} />} />
        <Route path="settings" element={<MinimalFeaturePage title="Teacher Settings" description="Manage your profile, notification preferences, and other settings." icon={<Icons.Cog className="w-16 h-16 text-gray-400 dark:text-gray-500 hc-text-secondary" />} />} />
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default TeacherDashboard;