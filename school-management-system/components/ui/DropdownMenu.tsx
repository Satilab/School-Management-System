import React, { useState, useRef, useEffect } from 'react';

export interface DropdownMenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactElement;
  disabled?: boolean;
  isSeparator?: boolean;
}

interface DropdownMenuProps {
  items: DropdownMenuItem[];
  icon?: React.ReactElement; // Trigger icon
  buttonText?: string; // Alternative to icon trigger
  align?: 'left' | 'right';
  buttonClassName?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items, icon, buttonText, align = 'right', buttonClassName = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card onClick if dropdown is on a card
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className={`inline-flex justify-center items-center w-full rounded-md p-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-academic-blue hc-text-secondary hc-hover:bg-gray-700 ${buttonClassName}`}
          onClick={toggleDropdown}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {icon || buttonText || 'Options'}
          {icon && !buttonText && <span className="sr-only">Options</span>}
        </button>
      </div>

      {isOpen && (
        <div
          className={`origin-top-${align} absolute ${align}-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 hc-bg-secondary hc-border-primary border`}
        >
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {items.map((item, index) => 
              item.isSeparator ? (
                <div key={`sep-${index}`} className="border-t border-gray-200 dark:border-gray-700 hc-border-primary my-1" />
              ) : (
                <button
                  key={item.label}
                  onClick={(e) => {
                    e.stopPropagation();
                    item.onClick();
                    setIsOpen(false);
                  }}
                  disabled={item.disabled}
                  className={`w-full text-left flex items-center px-4 py-2 text-sm 
                    ${item.disabled 
                      ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed hc-text-gray-500' 
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white hc-text-primary hc-hover:bg-gray-700'}
                  `}
                  role="menuitem"
                >
                  {item.icon && React.cloneElement(item.icon, Object.assign({}, item.icon.props, { className: 'w-4 h-4 mr-2' }))}
                  {item.label}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
