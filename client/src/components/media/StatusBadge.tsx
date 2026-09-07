import type { WatchStatus } from '@/lib/constants';
import { STATUS_LABELS } from '@/lib/constants';

const STATUS_COLORS: Record<WatchStatus, string> = {
  planning: 'bg-blue-500/20 text-blue-400',
  watching: 'bg-green-500/20 text-green-400',
  watched: 'bg-purple-500/20 text-purple-400',
  dropped: 'bg-red-500/20 text-red-400',
};

export function StatusBadge({ status }: { status: WatchStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
