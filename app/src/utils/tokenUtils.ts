interface JwtPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: unknown;
}

/**
 * Decode a JWT payload without verifying the signature.
 * Uses atob (available in Hermes / React Native).
 */
function decodeBase64Url(base64Url: string): string {
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  return atob(base64);
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = decodeBase64Url(parts[1]);
    return JSON.parse(payload) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Returns the number of milliseconds until the token expires.
 * Returns 0 if the token is already expired or cannot be decoded.
 */
export function getTokenExpiresIn(token: string): number {
  const payload = decodeJwt(token);
  if (!payload?.exp) return 0;
  const expiresAtMs = payload.exp * 1000;
  return Math.max(0, expiresAtMs - Date.now());
}

/**
 * True when the token will expire within `thresholdMs` (default 60 s).
 */
export function isTokenExpiringSoon(
  token: string,
  thresholdMs: number = 60_000,
): boolean {
  return getTokenExpiresIn(token) <= thresholdMs;
}

function normalizeRoles(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((role): role is string => typeof role === "string");
  }
  if (typeof value === "string") return [value];
  return [];
}

export function getTokenRoles(token: string): string[] {
  const payload = decodeJwt(token);
  return normalizeRoles(payload?.roles);
}

export function isAdminToken(token: string): boolean {
  const roles = getTokenRoles(token);
  return roles.includes("ADMIN") || roles.includes("ROLE_ADMIN");
}
