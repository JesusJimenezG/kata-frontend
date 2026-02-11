// ── Error ──────────────────────────────────────────────
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
}

// ── Auth ───────────────────────────────────────────────
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
}

// ── Resource Types ─────────────────────────────────────
export interface ResourceTypeRequest {
  name: string;
  description?: string;
}

export interface ResourceTypeResponse {
  id: number;
  name: string;
  description: string;
}

// ── Resources ──────────────────────────────────────────
export interface ResourceRequest {
  name: string;
  description?: string;
  resourceTypeId: number;
  location?: string;
}

export interface ResourceResponse {
  id: string;
  name: string;
  description: string;
  resourceType: ResourceTypeResponse;
  location: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceFilters {
  active?: boolean;
  typeId?: number;
}

// ── Reservations ───────────────────────────────────────
export interface CreateReservationRequest {
  resourceId: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface ReservationResponse {
  id: string;
  resourceId: string;
  resourceName: string;
  userId: string;
  userEmail: string;
  startTime: string;
  endTime: string;
  status: "ACTIVE" | "CANCELLED";
  notes: string | null;
  cancelledById: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilitySlot {
  start: string;
  end: string;
  available: boolean;
}
