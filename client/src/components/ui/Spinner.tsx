export function Spinner({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-gray-600 border-t-indigo-500 ${className}`}
    />
  );
}
