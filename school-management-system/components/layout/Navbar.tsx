import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole, NotificationMessage, ThemeOption, FontSizeOption } from '../../types';
import { Icons } from '../../constants';
import { NotificationContext } from '../../contexts/NotificationContext';
import { ThemeContext } from '../../contexts/ThemeContext';

export interface NavbarUser {
  name: string;
  role: UserRole;
  avatarUrl?: string;
}

interface NavbarProps {
  user: NavbarUser;
  onToggleSidebar: () => void;
  onSignOut: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onToggleSidebar, onSignOut }) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [themeSettingsDropdownOpen, setThemeSettingsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const { notifications, markAsRead, markAllAsRead, dismissNotification, clearReadNotifications } = useContext(NotificationContext);
  const { selectedTheme, fontSize, setThemeOption, setFontSizeOption } = useContext(ThemeContext);

  const unreadNotifications = notifications.filter(n => !n.read && !n.dismissed);
  const displayNotifications = notifications.filter(n => !n.dismissed).slice(0, 10); // Show up to 10 non-dismissed

  const getNotificationIcon = (type: NotificationMessage['type']) => {
    switch(type) {
      case 'ai': return <Icons.Lightbulb className="w-5 h-5 text-purple-500 dark:text-purple-400 hc-text-accent-secondary" />;
      case 'warning': return <Icons.Bell className="w-5 h-5 text-yellow-500 dark:text-yellow-400 hc-text-accent-primary" />; 
      case 'error': return <Icons.Close className="w-5 h-5 text-red-500 dark:text-red-400 hc-text-accent-primary" />; 
      case 'success': return <Icons.CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 hc-text-accent-secondary" />;
      default: return <Icons.Bell className="w-5 h-5 text-academic-blue dark:text-academic-blue hc-text-accent-secondary" />;
    }
  };

  const themeOptions: { value: ThemeOption; label: string; icon: React.ReactElement }[] = [
    { value: 'light', label: 'Light', icon: <Icons.Sun className="w-5 h-5 mr-2" /> },
    { value: 'dark', label: 'Dark', icon: <Icons.Moon className="w-5 h-5 mr-2" /> },
    { value: 'high-contrast', label: 'High Contrast', icon: <Icons.Contrast className="w-5 h-5 mr-2" /> },
  ];
  
  const fontSizeOptions: {value: FontSizeOption; label: string}[] = [
      {value: 'sm', label: 'Small'},
      {value: 'md', label: 'Medium'},
      {value: 'lg', label: 'Large'},
  ];

  const handleNotificationClick = (notif: NotificationMessage) => {
    markAsRead(notif.id);
    if (notif.linkTo) {
        navigate(notif.linkTo);
    }
    // setNotificationDropdownOpen(false); // Optionally close dropdown on click
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40 hc-bg-secondary hc-border-primary border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-academic-blue lg:hidden hc-text-secondary"
              aria-label="Toggle sidebar"
            >
              <Icons.Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-academic-blue-dark dark:text-academic-blue ml-2 hidden sm:block hc-text-primary">School Portal</h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Theme & Settings Dropdown */}
            <div className="relative">
              <button
                onClick={() => setThemeSettingsDropdownOpen(!themeSettingsDropdownOpen)}
                className="p-1 rounded-full text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-academic-blue hc-text-secondary"
                aria-label="Theme & Display Settings"
              >
                <Icons.Palette className="h-6 w-6" />
              </button>
              {themeSettingsDropdownOpen && (
                <div
                  onMouseLeave={() => setThemeSettingsDropdownOpen(false)}
                  className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black dark:ring-gray-600 ring-opacity-5 focus:outline-none hc-bg-secondary hc-border-primary border"
                >
                  <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 hc-text-secondary uppercase font-semibold">Theme</div>
                  {themeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setThemeOption(opt.value); }}
                      className={`w-full text-left flex items-center px-4 py-2 text-sm ${
                        selectedTheme === opt.value ? 'bg-academic-blue text-white dark:bg-blue-600 hc-button-primary' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 hc-text-primary hc-hover:bg-gray-700'
                      }`}
                    >
                      {(() => {
                        const newClassName = `w-4 h-4 mr-2 ${selectedTheme === opt.value ? 'text-white dark:text-white hc-text-primary' : 'text-gray-500 dark:text-gray-400 hc-text-secondary'}`;
                        const newProps = Object.assign({}, opt.icon.props, { className: newClassName });
                        return React.cloneElement(opt.icon, newProps);
                      })()}
                      {opt.label}
                    </button>
                  ))}
                  <div className="border-t border-gray-200 dark:border-gray-600 hc-border-primary my-1"></div>
                  <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 hc-text-secondary uppercase font-semibold">Font Size</div>
                   {fontSizeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setFontSizeOption(opt.value); }}
                      className={`w-full text-left flex items-center px-4 py-2 text-sm ${
                        fontSize === opt.value ? 'bg-academic-blue text-white dark:bg-blue-600 hc-button-primary' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 hc-text-primary hc-hover:bg-gray-700'
                      }`}
                    >
                      <span className={`w-4 h-4 mr-2 text-center font-mono ${fontSize === opt.value ? 'text-white dark:text-white hc-text-primary' : 'text-gray-500 dark:text-gray-400 hc-text-secondary'}`}>{opt.label[0]}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                className="relative p-1 rounded-full text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-academic-blue hc-text-secondary"
                aria-label="View notifications"
              >
                <span className="sr-only">View notifications</span>
                <Icons.Bell className="h-6 w-6" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-gray-800 bg-red-500 hc-bg-accent-primary hc-ring-black" />
                )}
              </button>
              {notificationDropdownOpen && (
                <div 
                  className="origin-top-right absolute right-0 mt-2 w-80 sm:w-96 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black dark:ring-gray-600 ring-opacity-5 focus:outline-none max-h-[70vh] overflow-y-auto hc-bg-secondary hc-border-primary border"
                  onMouseLeave={() => setNotificationDropdownOpen(false)}
                >
                  <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-600 hc-border-primary">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 hc-text-primary">Notifications</h3>
                    <div className="space-x-2">
                        {unreadNotifications.length > 0 && (
                            <button onClick={markAllAsRead} className="text-xs text-academic-blue dark:text-blue-400 hover:underline hc-text-accent-secondary">Mark all read</button>
                        )}
                         {notifications.filter(n => n.read && !n.dismissed).length > 0 && (
                            <button onClick={clearReadNotifications} className="text-xs text-red-500 dark:text-red-400 hover:underline hc-text-accent-primary">Clear read</button>
                        )}
                    </div>
                  </div>
                  {displayNotifications.length === 0 ? (
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4 hc-text-secondary">No new notifications.</p>
                  ) : (
                    <ul className="divide-y divide-gray-100 dark:divide-gray-600 hc-divide-border-primary">
                      {displayNotifications.map(notif => ( 
                        <li key={notif.id} className={`relative p-3 hover:bg-gray-50 dark:hover:bg-gray-600 ${!notif.read ? 'bg-blue-50 dark:bg-blue-900/50 hc-bg-secondary' : 'hc-bg-secondary'}`}>
                          <div className="block cursor-pointer" onClick={() => handleNotificationClick(notif)}>
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 pt-0.5">
                                {notif.icon || getNotificationIcon(notif.type)}
                              </div>
                              <div className="flex-1 pr-4"> {/* Added pr-4 to make space for dismiss button */}
                                <p className={`text-sm font-medium ${!notif.read ? 'text-gray-800 dark:text-white hc-text-primary' : 'text-gray-600 dark:text-gray-300 hc-text-secondary'}`}>{notif.title}</p>
                                <p className={`text-xs ${!notif.read ? 'text-gray-600 dark:text-gray-300 hc-text-secondary' : 'text-gray-500 dark:text-gray-400 hc-text-secondary'}`}>{notif.message}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 hc-text-secondary">{new Date(notif.timestamp).toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); dismissNotification(notif.id);}} 
                            className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-500 hc-hover:bg-gray-700"
                            aria-label="Dismiss notification"
                           >
                            <Icons.Close className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hc-text-secondary"/>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {notifications.filter(n => !n.dismissed).length > 10 && (
                     <div className="text-center py-2 border-t border-gray-200 dark:border-gray-600 hc-border-primary">
                        {/* This link should ideally go to a full notifications page if implemented */}
                        <Link to="#" className="text-xs text-academic-blue dark:text-blue-400 hover:underline hc-text-accent-secondary">View all notifications</Link> 
                     </div>
                  )}
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-academic-blue"
              >
                <span className="sr-only">Open user menu</span>
                <img className="h-8 w-8 rounded-full" src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=random`} alt="User avatar" />
                <span className="ml-2 hidden md:inline text-gray-700 dark:text-gray-200 hc-text-primary">{user.name}</span>
                <Icons.ChevronDown className="ml-1 h-4 w-4 text-gray-500 dark:text-gray-400 hidden md:inline hc-text-secondary"/>
              </button>
              {profileDropdownOpen && (
                <div 
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black dark:ring-gray-600 ring-opacity-5 focus:outline-none hc-bg-secondary hc-border-primary border">
                  <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 hc-text-secondary">
                    Signed in as <strong className="block text-gray-700 dark:text-gray-200 hc-text-primary">{user.name}</strong> ({user.role})
                  </div>
                  <Link
                    to="#" // Placeholder for profile page
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 hc-text-primary hc-hover:bg-gray-700"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <Link
                    to={user.role === UserRole.STUDENT ? "/student/settings" : "#"} 
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 hc-text-primary hc-hover:bg-gray-700"
                     onClick={() => setProfileDropdownOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      onSignOut();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 hc-text-primary hc-hover:bg-gray-700"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
