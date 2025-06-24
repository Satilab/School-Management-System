import React, { useState, useEffect, useContext } from 'react'; // Added useContext
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserRole } from './types';
import AdminDashboard from './features/admin/AdminDashboard';
import TeacherDashboard from './features/teacher/TeacherDashboard';
import StudentDashboard from './features/student/StudentDashboard';
import ParentDashboard from './features/parent/ParentDashboard';
import RoleSwitcher from './features/auth/RoleSwitcher';
import { NavbarUser } from './components/layout/Navbar'; 
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider, ThemeContext } from './contexts/ThemeContext'; // Import ThemeProvider and ThemeContext

// Main App component that applies theme and font size globally
const ThemedApp: React.FC = () => {
  const { fontSize } = useContext(ThemeContext); // Get fontSize from context

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-size-sm', 'text-size-md', 'text-size-lg');
    root.classList.add(`text-size-${fontSize}`);
  }, [fontSize]);

  return <AppContent />; // Render the actual app content
};


const AppContent: React.FC = () => {
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState<string>('Guest');

  useEffect(() => {
    const storedRole = localStorage.getItem('currentUserRole') as UserRole;
    if (storedRole && Object.values(UserRole).includes(storedRole)) {
      setCurrentUserRole(storedRole);
      setUserName(getRoleBasedUserName(storedRole));
    }
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setCurrentUserRole(role);
    setUserName(getRoleBasedUserName(role));
    localStorage.setItem('currentUserRole', role);
  };
  
  const getRoleBasedUserName = (role: UserRole): string => {
    switch (role) {
      case UserRole.ADMIN: return "Admin User";
      case UserRole.TEACHER: return "Teacher Smith";
      case UserRole.STUDENT: return "Student Jane";
      case UserRole.PARENT: return "Parent Doe";
      default: return "Guest"; 
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('currentUserRole');
    setCurrentUserRole(null);
    setUserName('Guest');
  };

  const currentUser: NavbarUser = {
    name: userName,
    role: currentUserRole || UserRole.STUDENT, 
    avatarUrl: 'https://picsum.photos/100/100',
  };


  if (!currentUserRole) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-academic-blue to-accent-yellow dark:from-gray-800 dark:to-gray-700 p-4 hc-bg-primary">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl text-center w-full max-w-md hc-bg-secondary">
            <h1 className="text-3xl font-bold text-academic-blue-dark dark:text-academic-blue mb-6 hc-text-primary">Welcome to School Management</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8 hc-text-secondary">Please select your role to continue:</p>
            <RoleSwitcher onRoleSelect={handleRoleChange} />
          </div>
        </div>
    );
  }

  return (
      <NotificationProvider>
        <HashRouter>
          <Routes>
            <Route path="/admin/*" element={currentUserRole === UserRole.ADMIN ? <AdminDashboard user={currentUser} onSignOut={handleSignOut} /> : <Navigate to="/" />} />
            <Route path="/teacher/*" element={currentUserRole === UserRole.TEACHER ? <TeacherDashboard user={currentUser} onSignOut={handleSignOut} /> : <Navigate to="/" />} />
            <Route path="/student/*" element={currentUserRole === UserRole.STUDENT ? <StudentDashboard user={currentUser} onSignOut={handleSignOut} /> : <Navigate to="/" />} />
            <Route path="/parent/*" element={currentUserRole === UserRole.PARENT ? <ParentDashboard user={currentUser} onSignOut={handleSignOut} /> : <Navigate to="/" />} />
            
            <Route path="/" element={<NavigateToDashboard role={currentUserRole} />} />
          </Routes>
        </HashRouter>
      </NotificationProvider>
  );
};

// Wrapper component that provides the ThemeProvider
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
};


interface NavigateToDashboardProps {
  role: UserRole;
}

const NavigateToDashboard: React.FC<NavigateToDashboardProps> = ({ role }) => {
  let path: string;
  switch (role) {
    case UserRole.ADMIN:
      path = "/admin/overview";
      break;
    case UserRole.TEACHER:
      path = "/teacher/overview";
      break;
    case UserRole.STUDENT:
      path = "/student/overview";
      break;
    case UserRole.PARENT:
      path = "/parent/overview";
      break;
    default:
      // Fallback for any unhandled roles, though TS should ensure role is valid
      console.warn("NavigateToDashboard: Unhandled role, defaulting to /");
      path = "/"; 
      break;
  }
  return <Navigate to={path} replace />;
};

export default App;