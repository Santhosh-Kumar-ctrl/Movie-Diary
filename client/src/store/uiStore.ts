import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface UiState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  toasts: Toast[];
  toggleSidebar: () => void;
  toggleTheme: () => void;
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  theme: (typeof window !== 'undefined' && localStorage.getItem('theme') as 'light' | 'dark') || 'dark',
  toasts: [],
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleTheme: () =>
    set((s) => {
      const next = s.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      return { theme: next };
    }),
  addToast: (message, type) =>
    set((s) => ({
      toasts: [...s.toasts, { id: crypto.randomUUID(), message, type }],
    })),
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
