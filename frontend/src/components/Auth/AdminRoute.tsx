
import { useEffect } from 'react';
import { isAdmin } from '@/utils/auth';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  useEffect(() => {
    if (!isAdmin()) {
      window.location.href = '/dashboard';
    }
  }, []);

  return <>{children}</>;
};