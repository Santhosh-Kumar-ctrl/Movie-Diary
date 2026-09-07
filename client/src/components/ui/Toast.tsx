import { useEffect } from 'react';
import { useUiStore } from '@/store/uiStore';

const TOAST_COLORS = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-blue-600',
};

export function ToastContainer() {
  const toasts = useUiStore((s) => s.toasts);
  const removeToast = useUiStore((s) => s.removeToast);

  return (
    <div className="fixed right-4 top-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} id={toast.id} message={toast.message} type={toast.type} onDismiss={removeToast} />
      ))}
    </div>
  );
}

function ToastItem({
  id,
  message,
  type,
  onDismiss,
}: {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), 4000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <div
      className={`${TOAST_COLORS[type]} flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg`}
    >
      <span>{message}</span>
      <button onClick={() => onDismiss(id)} className="ml-2 text-white/70 hover:text-white">
        &times;
      </button>
    </div>
  );
}
