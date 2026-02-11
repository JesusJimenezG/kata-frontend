/** Refresh the access token this many ms before it expires. */
export const REFRESH_AHEAD_MS = 60_000; // 60 seconds

/** Minimum refetch interval floor to avoid tight loops (ms). */
export const MIN_REFRESH_INTERVAL_MS = 5_000;
