import React from 'react';
import { UserRole } from '../../types';
// Button component removed as custom styling is used here
import { Icons } from '../../constants';

interface RoleSwitcherProps {
  onRoleSelect: (role: UserRole) => void;
}

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ onRoleSelect }) => {
  const roles = [
    { role: UserRole.ADMIN, label: 'Admin', icon: <Icons.Dashboard className="w-8 h-8 mx-auto mb-2" /> },
    { role: UserRole.TEACHER, label: 'Teacher', icon: <Icons.Teachers className="w-8 h-8 mx-auto mb-2" /> },
    { role: UserRole.STUDENT, label: 'Student', icon: <Icons.Students className="w-8 h-8 mx-auto mb-2" /> },
    { role: UserRole.PARENT, label: 'Parent', icon: <Icons.Communication className="w-8 h-8 mx-auto mb-2" /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {roles.map(({ role, label, icon }) => (
        <button
          key={role}
          onClick={() => onRoleSelect(role)}
          className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-700 hover:bg-academic-blue dark:hover:bg-blue-600 hover:text-white dark:hover:text-white text-academic-blue-dark dark:text-academic-blue rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:ring-opacity-50 hc-bg-secondary hc-text-primary hc-border-primary border hc-hover:bg-gray-700"
        >
          {React.cloneElement(icon, {className: "w-8 h-8 mx-auto mb-2 current-color"})}
          <span className="text-lg font-semibold current-color">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default RoleSwitcher;