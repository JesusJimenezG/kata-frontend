import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reservationsService } from "./reservationsService";
import type {
  AvailabilitySlot,
  CreateReservationRequest,
  ReservationResponse,
} from "../types";

export const reservationKeys = {
  all: ["reservations"] as const,
  active: () => [...reservationKeys.all, "active"] as const,
  myActive: () => [...reservationKeys.all, "my-active"] as const,
  myHistory: () => [...reservationKeys.all, "my-history"] as const,
  detail: (id: string) => [...reservationKeys.all, "detail", id] as const,
  resourceHistory: (resourceId: string) =>
    [...reservationKeys.all, "resource-history", resourceId] as const,
  resourceAvailability: (resourceId: string, start: string, end: string) =>
    [...reservationKeys.all, "availability", resourceId, start, end] as const,
};

// ── Queries ────────────────────────────────────────────

export function useReservation(id: string) {
  return useQuery<ReservationResponse>({
    queryKey: reservationKeys.detail(id),
    queryFn: () => reservationsService.getById(id),
    enabled: !!id,
  });
}

export function useActiveReservations() {
  return useQuery<ReservationResponse[]>({
    queryKey: reservationKeys.active(),
    queryFn: () => reservationsService.getActive(),
  });
}

export function useMyActiveReservations() {
  return useQuery<ReservationResponse[]>({
    queryKey: reservationKeys.myActive(),
    queryFn: () => reservationsService.getMyActive(),
  });
}

export function useMyReservationHistory() {
  return useQuery<ReservationResponse[]>({
    queryKey: reservationKeys.myHistory(),
    queryFn: () => reservationsService.getMyHistory(),
  });
}

export function useResourceReservationHistory(resourceId: string) {
  return useQuery<ReservationResponse[]>({
    queryKey: reservationKeys.resourceHistory(resourceId),
    queryFn: () => reservationsService.getResourceHistory(resourceId),
    enabled: !!resourceId,
  });
}

export function useResourceAvailability(
  resourceId: string,
  start: string,
  end: string,
) {
  return useQuery<AvailabilitySlot[]>({
    queryKey: reservationKeys.resourceAvailability(resourceId, start, end),
    queryFn: () =>
      reservationsService.getResourceAvailability(resourceId, start, end),
    enabled: !!resourceId && !!start && !!end,
  });
}

// ── Mutations ──────────────────────────────────────────

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation<ReservationResponse, Error, CreateReservationRequest>({
    mutationFn: (data) => reservationsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.active() });
      queryClient.invalidateQueries({ queryKey: reservationKeys.myActive() });
      queryClient.invalidateQueries({ queryKey: reservationKeys.myHistory() });
    },
  });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation<ReservationResponse, Error, string>({
    mutationFn: (id) => reservationsService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.all });
    },
  });
}
