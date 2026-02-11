// ── Types ──────────────────────────────────────────────
export type {
  ApiError,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  ResourceTypeRequest,
  ResourceTypeResponse,
  ResourceRequest,
  ResourceResponse,
  ResourceFilters,
  CreateReservationRequest,
  ReservationResponse,
  AvailabilitySlot,
} from "./types";

// ── Client ─────────────────────────────────────────────
export { apiClient, setAuthFailureHandler } from "./client";
export { tokenStorage } from "./tokenStorage";

// ── Auth ───────────────────────────────────────────────
export {
  authService,
  useLogin,
  useRegister,
  useLogout,
  useSessionRefresh,
  authKeys,
} from "./auth";

// ── Resource Types ─────────────────────────────────────
export {
  resourceTypesService,
  useResourceTypes,
  useResourceType,
  useCreateResourceType,
  useUpdateResourceType,
  useDeleteResourceType,
  resourceTypeKeys,
} from "./resourceTypes";

// ── Resources ──────────────────────────────────────────
export {
  resourcesService,
  useResources,
  useResource,
  useCreateResource,
  useUpdateResource,
  useDeleteResource,
  resourceKeys,
} from "./resources";

// ── Reservations ───────────────────────────────────────
export {
  reservationsService,
  useReservation,
  useActiveReservations,
  useMyActiveReservations,
  useMyReservationHistory,
  useResourceReservationHistory,
  useResourceAvailability,
  useCreateReservation,
  useCancelReservation,
  reservationKeys,
} from "./reservations";
