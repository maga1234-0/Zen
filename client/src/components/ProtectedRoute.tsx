import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { hasPermission, Permission } from '@/utils/permissions';
import { AlertCircle } from 'lucide-react';
import { Card } from './ui/Card';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: Permission;
}

export const ProtectedRoute = ({ children, requiredPermission }: ProtectedRouteProps) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(user.role, requiredPermission)) {
    return (
      <div className="p-6">
        <Card className="max-w-2xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 dark:text-slate-300 mb-4">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Your role: <span className="font-semibold capitalize">{user.role}</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Required permission: <span className="font-mono text-xs">{requiredPermission}</span>
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
