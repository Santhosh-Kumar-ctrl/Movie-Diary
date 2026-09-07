import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Spinner } from '@/components/ui/Spinner';

const LoginPage = lazy(() => import('@/features/auth/LoginPage'));
const SignupPage = lazy(() => import('@/features/auth/SignupPage'));
const AuthCallback = lazy(() => import('@/features/auth/AuthCallback'));
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'));
const SearchPage = lazy(() => import('@/features/search/SearchPage'));
const MovieDetailPage = lazy(() => import('@/features/details/MovieDetailPage'));
const TvDetailPage = lazy(() => import('@/features/details/TvDetailPage'));
const WatchlistPage = lazy(() => import('@/features/watchlist/WatchlistPage'));
const ProfilePage = lazy(() => import('@/features/profile/ProfilePage'));
const FriendsPage = lazy(() => import('@/features/social/FriendsPage'));
const ActivityFeedPage = lazy(() => import('@/features/social/ActivityFeed'));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>,
  },
  {
    path: '/signup',
    element: <SuspenseWrapper><SignupPage /></SuspenseWrapper>,
  },
  {
    path: '/auth/callback',
    element: <SuspenseWrapper><AuthCallback /></SuspenseWrapper>,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: '/',
            element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper>,
          },
          {
            path: '/search',
            element: <SuspenseWrapper><SearchPage /></SuspenseWrapper>,
          },
          {
            path: '/movie/:tmdbId',
            element: <SuspenseWrapper><MovieDetailPage /></SuspenseWrapper>,
          },
          {
            path: '/tv/:tmdbId',
            element: <SuspenseWrapper><TvDetailPage /></SuspenseWrapper>,
          },
          {
            path: '/watchlist',
            element: <SuspenseWrapper><WatchlistPage /></SuspenseWrapper>,
          },
          {
            path: '/profile',
            element: <SuspenseWrapper><ProfilePage /></SuspenseWrapper>,
          },
          {
            path: '/user/:userId',
            element: <SuspenseWrapper><ProfilePage /></SuspenseWrapper>,
          },
          {
            path: '/friends',
            element: <SuspenseWrapper><FriendsPage /></SuspenseWrapper>,
          },
          {
            path: '/feed',
            element: <SuspenseWrapper><ActivityFeedPage /></SuspenseWrapper>,
          },
        ],
      },
    ],
  },
]);
