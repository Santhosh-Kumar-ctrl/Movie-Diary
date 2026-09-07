import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/'), 1000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-indigo-500" />
        <p className="mt-4 text-gray-400">Completing sign in...</p>
      </div>
    </div>
  );
}
