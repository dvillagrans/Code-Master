import Cookies from 'js-cookie';

interface UserData {
  username: string;
  email: string;
  role: 'admin' | 'user';
}

export const getUserData = (): UserData | null => {
  const userData = Cookies.get('user_data');
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};

export const isAdmin = (): boolean => {
  const userData = getUserData();
  return userData?.role === 'admin';
};

export const requireAdmin = (): void => {
  if (!isAdmin()) {
    window.location.href = '/dashboard';
  }
};
