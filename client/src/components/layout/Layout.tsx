import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export function Layout() {
  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
}
