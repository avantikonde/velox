/**
 * Formats a timestamp (epoch ms or Date or string) to a human-readable relative string.
 * Automatically handles sub-second and seconds-level precision.
 */
export function formatTimeAgo(timestamp?: number | string | Date): string {
  if (!timestamp) return 'Just now';

  let time: number;
  if (typeof timestamp === 'number') {
    time = timestamp;
  } else if (typeof timestamp === 'string') {
    const parsed = Number(timestamp);
    if (!isNaN(parsed) && parsed > 1000000000) {
      time = parsed;
    } else {
      const dateParsed = new Date(timestamp).getTime();
      if (!isNaN(dateParsed)) {
        time = dateParsed;
      } else {
        return timestamp; // Return fallback string like "Just now"
      }
    }
  } else if (timestamp instanceof Date) {
    time = timestamp.getTime();
  } else {
    return 'Just now';
  }

  const now = Date.now();
  const diffSec = Math.max(0, Math.floor((now - time) / 1000));

  if (diffSec < 3) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

/**
 * Returns formatted local time string like "16:35:42"
 */
export function formatExactTime(timestamp?: number | string | Date): string {
  if (!timestamp) return '';
  const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

