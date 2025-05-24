// context/NotificationContext.tsx
import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext({
  unreadCount: 0,
  setUnreadCount: (count: number) => {}
});

export const NotificationProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <NotificationContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
