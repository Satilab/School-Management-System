import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  title?: string;
  actions?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, actions, ...rest }) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden hc-bg-secondary hc-border-primary border ${className}`} 
      {...rest}
    >
      {(title || actions) && (
        <div className="px-4 py-3 sm:px-6 border-b border-gray-200 dark:border-gray-700 hc-border-primary flex justify-between items-center">
          {title && <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 hc-text-primary">{title}</h3>}
          {actions && <div className="flex-shrink-0">{actions}</div>}
        </div>
      )}
      <div className="p-4 sm:p-6 text-gray-700 dark:text-gray-300 hc-text-secondary">
        {children}
      </div>
    </div>
  );
};

export default Card;