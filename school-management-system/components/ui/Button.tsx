import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const baseStyles = "font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 ease-in-out inline-flex items-center justify-center dark:focus:ring-offset-gray-800 hc:focus:ring-offset-black";

  // Theme-aware styles
  const variantStyles = {
    primary: 'bg-academic-blue text-white hover:bg-academic-blue-dark focus:ring-academic-blue dark:bg-blue-500 dark:hover:bg-blue-600 hc-button-primary',
    secondary: 'bg-accent-yellow text-white hover:bg-accent-yellow-dark focus:ring-accent-yellow dark:bg-amber-500 dark:hover:bg-amber-600 hc-bg-accent-secondary hc-text-black hc-border-black', // Example for HC
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600 hc-bg-red-600 hc-text-white hc-border-white',
    ghost: 'text-academic-blue hover:bg-blue-100 focus:ring-academic-blue dark:text-blue-400 dark:hover:bg-gray-700 hc-text-primary hc-hover:bg-gray-700',
    outline: 'border border-academic-blue text-academic-blue hover:bg-blue-50 focus:ring-academic-blue dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-700 hc-button-outline',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const loadingStyles = isLoading ? 'opacity-75 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${loadingStyles} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className={`animate-spin -ml-1 mr-3 h-5 w-5 ${variant === 'primary' || variant === 'secondary' || variant === 'danger' ? 'text-white hc-text-black' : 'text-current'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;