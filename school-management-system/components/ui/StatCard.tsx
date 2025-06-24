
import React from 'react';
import Card from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement; // Changed from React.ReactNode
  description?: string;
  colorClass?: string; // e.g., 'text-blue-500' for icon and value
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description, colorClass = 'text-academic-blue' }) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-opacity-20 ${colorClass.replace('text-', 'bg-')}`}>
          {React.cloneElement(icon as React.ReactElement<React.SVGProps<SVGSVGElement>>, { className: `w-6 h-6 ${colorClass}` })}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className={`text-2xl font-semibold ${colorClass}`}>{value}</p>
        </div>
      </div>
      {description && (
        <p className="mt-2 text-xs text-gray-500">{description}</p>
      )}
    </Card>
  );
};

export default StatCard;
