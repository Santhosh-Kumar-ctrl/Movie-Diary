import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { useUiStore } from '@/store/uiStore';

const NAV_LINKS = [
  { to: '/', label: 'Dashboard' },
  { to: '/search', label: 'Search' },
  { to: '/watchlist', label: 'My List' },
  { to: '/feed', label: 'Feed' },
  { to: '/friends', label: 'Friends' },
] as const;

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useUiStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="border-b border-border-main bg-surface-raised">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          {user && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 text-text-muted hover:bg-surface-overlay hover:text-text-heading md:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          )}

          <Link to="/" className="text-xl font-bold text-text-heading">
            WatchTrack
          </Link>

          {user && (
            <nav className="hidden items-center gap-6 md:flex">
              {NAV_LINKS.map((link) => (
                <Link key={link.to} to={link.to} className="text-sm text-text-body hover:text-text-heading">
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-text-muted hover:bg-surface-overlay hover:text-text-heading"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            )}
          </button>

          {user && (
            <div className="hidden items-center gap-3 md:flex">
              <Link to="/profile" className="text-sm text-text-body hover:text-text-heading">
                Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded-lg bg-surface-overlay px-3 py-1.5 text-sm text-text-body hover:text-text-heading"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {user && mobileOpen && (
        <nav className="border-t border-border-main bg-surface-raised px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-text-body hover:bg-surface-overlay hover:text-text-heading"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/profile"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 text-sm text-text-body hover:bg-surface-overlay hover:text-text-heading"
            >
              Profile
            </Link>
            <button
              onClick={() => { setMobileOpen(false); handleSignOut(); }}
              className="rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-surface-overlay"
            >
              Sign out
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
