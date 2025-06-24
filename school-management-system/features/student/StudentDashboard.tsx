import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { NavbarUser } from '../../components/layout/Navbar';
import { NavItem, UserRole } from '../../types';
import { Icons } from '../../constants';
import StudentOverviewContent from './StudentOverviewContent';
import StudentAssignmentsPage from './StudentAssignmentsPage'; 
import StudentTimetablePage from './StudentTimetablePage';   
import StudentGradesPage from './StudentGradesPage';
import StudentEventsPage from './StudentEventsPage';
import StudentAISummariesPage from './StudentAISummariesPage';
import StudentGrowthAdvisorPage from './StudentGrowthAdvisorPage'; 
import StudentSettingsPage from './StudentSettingsPage'; // Import new settings page
import MinimalFeaturePage from '../shared/MinimalFeaturePage';
import { mockStudents as allMockStudents } from '../../services/mockData';

interface StudentDashboardProps {
  user: NavbarUser;
  onSignOut: () => void;
}

const studentNavItems: NavItem[] = [
  { name: 'Overview', path: 'overview', icon: <Icons.Dashboard className="w-5 h-5"/> },
  { name: 'My Schedule', path: 'schedule', icon: <Icons.Timetable className="w-5 h-5"/> },
  { name: 'Assignments', path: 'assignments', icon: <Icons.Assignments className="w-5 h-5"/> },
  { name: 'Grades', path: 'grades', icon: <Icons.Grades className="w-5 h-5"/> },
  { name: 'AI Summaries', path: 'ai-summaries', icon: <Icons.Lightbulb className="w-5 h-5"/> }, 
  { name: 'Growth Advisor', path: 'growth-advisor', icon: <Icons.TrendingUp className="w-5 h-5"/> }, 
  { name: 'Events', path: 'events', icon: <Icons.Events className="w-5 h-5"/> },
  { name: 'Messages', path: 'messages', icon: <Icons.Communication className="w-5 h-5"/> },
  { name: 'Settings', path: 'settings', icon: <Icons.Cog className="w-5 h-5"/> }, // Updated icon
];

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onSignOut }) => {
  const studentData = allMockStudents.find(s => s.name === user.name);
  const studentId = studentData?.id || 'S005'; 
  const studentClassId = studentData?.classId || '10B'; 


  return (
    <DashboardLayout user={user} navItems={studentNavItems} currentRole={UserRole.STUDENT} onSignOut={onSignOut}>
      <Routes>
        <Route path="overview" element={<StudentOverviewContent studentName={user.name} />} />
        <Route path="schedule" element={<StudentTimetablePage studentClassId={studentClassId} />} />
        <Route path="assignments" element={<StudentAssignmentsPage studentClassId={studentClassId} />} />
        <Route path="grades" element={<StudentGradesPage studentId={studentId} />} />
        <Route path="ai-summaries" element={<StudentAISummariesPage studentId={studentId} />} />
        <Route path="growth-advisor" element={<StudentGrowthAdvisorPage studentId={studentId} />} /> 
        <Route path="events" element={<StudentEventsPage />} />
        <Route path="messages" element={<MinimalFeaturePage title="My Messages" description="View messages from teachers and school administration, and send replies." icon={<Icons.Communication className="w-16 h-16 text-gray-400 dark:text-gray-500 hc-text-secondary" />} />} />
        <Route path="settings" element={<StudentSettingsPage />} /> {/* New Route for settings */}
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default StudentDashboard;