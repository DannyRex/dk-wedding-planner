import { cn, statusColor, priorityColor, areaColor } from '@/lib/utils';
import type { WeddingArea } from '@/lib/types';

export function StatusBadge({ status }: { status: string }) {
  return <span className={cn('badge', statusColor(status))}>{status}</span>;
}

export function PriorityBadge({ priority }: { priority: string }) {
  return <span className={cn('badge', priorityColor(priority))}>{priority}</span>;
}

export function AreaBadge({ area }: { area: WeddingArea }) {
  const label = area === 'Pre-Wedding Shoot' ? 'Pre-Wedding' : area.replace(' Wedding', '');
  return <span className={cn('badge', areaColor(area))}>{label}</span>;
}
