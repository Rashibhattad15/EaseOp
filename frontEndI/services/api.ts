export const API_URL = 'http://192.168.137.1:5000';

export const endpoints = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
  },
  user: {
    profile: '/api/user/profile',
  },
  notificationManager: {
    notifyAdmin: '/api/notifications//notify-admins',
    subscribeToAdmin: '/api/notifications/subscribe-admin',
    
  }
};
