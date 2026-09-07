import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export function ProtectedRoute() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-indigo-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
