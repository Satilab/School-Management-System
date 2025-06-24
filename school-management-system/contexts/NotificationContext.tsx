import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { NotificationMessage } from '../types';
import { Icons } from '../constants'; // For default icons

interface NotificationContextType {
  notifications: NotificationMessage[];
  addNotification: (notification: Omit<NotificationMessage, 'id' | 'timestamp' | 'read' | 'icon' | 'dismissed'> & { iconType?: keyof typeof Icons, linkTo?: string }) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  clearReadNotifications: () => void; // Renamed from clearNotifications for clarity
  clearNotifications: () => void; // Kept for general clear all if needed
}

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  dismissNotification: () => {},
  clearReadNotifications: () => {},
  clearNotifications: () => {},
});

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

  const addNotification = useCallback((notification: Omit<NotificationMessage, 'id' | 'timestamp' | 'read' | 'icon' | 'dismissed'> & { iconType?: keyof typeof Icons, linkTo?: string }) => {
    const newNotification: NotificationMessage = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
      dismissed: false,
      icon: notification.iconType ? React.createElement(Icons[notification.iconType], {className: 'w-5 h-5'}) : undefined,
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep latest 50
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, dismissed: true } : n));
    // Optionally, fully remove after a delay or animation:
    // setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 500);
  }, []);
  
  const clearReadNotifications = useCallback(() => {
    // Marks all read notifications as dismissed (effectively hiding them)
    setNotifications(prev => prev.map(n => n.read ? { ...n, dismissed: true } : n ));
    // Optionally, fully remove them:
    // setNotifications(prev => prev.filter(n => !n.read));
  }, []);

  const clearNotifications = useCallback(() => { // Clears ALL notifications
    setNotifications([]);
  }, []);


  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAsRead, markAllAsRead, dismissNotification, clearReadNotifications, clearNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};