/**
 * Format an ISO-8601 date string to a human-readable format.
 * Example: "2026-02-12T09:00:00" → "Feb 12, 2026"
 */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format an ISO-8601 date string to time.
 * Example: "2026-02-12T09:00:00" → "9:00 AM"
 */
export function formatTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format an ISO-8601 date string to date + time.
 * Example: "2026-02-12T09:00:00" → "Feb 12, 2026 · 9:00 AM"
 */
export function formatDateTime(iso: string): string {
  return `${formatDate(iso)} · ${formatTime(iso)}`;
}

/**
 * Format a date range from two ISO strings.
 * Same-day: "Feb 12, 2026 · 9:00 AM – 10:00 AM"
 * Different days: "Feb 12 9:00 AM – Feb 13 10:00 AM"
 */
export function formatDateRange(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);

  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  if (sameDay) {
    return `${formatDate(startIso)} · ${formatTime(startIso)} – ${formatTime(endIso)}`;
  }

  return `${formatDateTime(startIso)} – ${formatDateTime(endIso)}`;
}

/**
 * Convert a Date to ISO-8601 string (without timezone) for API calls.
 * Example: Date → "2026-02-12T09:00:00"
 */
export function toApiDateTime(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

/**
 * Get start of day as ISO string for API calls.
 */
export function startOfDay(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return toApiDateTime(d);
}

/**
 * Get end of day as ISO string for API calls.
 */
export function endOfDay(date: Date): string {
  const d = new Date(date);
  d.setHours(23, 59, 59, 0);
  return toApiDateTime(d);
}

/**
 * Add days to a date.
 */
export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
