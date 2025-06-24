import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  description?: string;
  icon?: React.ReactElement;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, id, description, icon, className, ...props }) => {
  return (
    <div className={`relative flex items-start p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 hc-hover:bg-gray-700 ${className}`}>
      {icon && <div className="mr-2 flex-shrink-0 pt-0.5">{icon}</div>}
      <div className="min-w-0 flex-1 text-sm">
        <label htmlFor={id} className="font-medium text-gray-700 dark:text-gray-200 hc-text-primary select-none cursor-pointer">
          {label}
        </label>
        {description && <p id={`${id}-description`} className="text-xs text-gray-500 dark:text-gray-400 hc-text-secondary">{description}</p>}
      </div>
      <div className="ml-3 flex items-center h-5">
        <input
          id={id}
          name={id}
          type="checkbox"
          className="focus:ring-academic-blue h-4 w-4 text-academic-blue border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:checked:bg-academic-blue dark:focus:ring-offset-gray-800 hc-bg-primary hc-border-primary hc:checked:bg-accent-primary cursor-pointer"
          aria-describedby={description ? `${id}-description` : undefined}
          {...props}
        />
      </div>
    </div>
  );
};

export default Checkbox;