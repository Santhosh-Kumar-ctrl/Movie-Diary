import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './router';
import { useAuth } from '@/features/auth/useAuth';
import { ToastContainer } from '@/components/ui/Toast';
import { useUiStore } from '@/store/uiStore';
import { useEffect } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function ThemeManager() {
  const theme = useUiStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return null;
}

function AuthInitializer() {
  useAuth();
  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeManager />
      <AuthInitializer />
      <ToastContainer />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
