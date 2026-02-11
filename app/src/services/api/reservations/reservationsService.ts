import { apiClient } from "../client";
import type {
  AvailabilitySlot,
  CreateReservationRequest,
  ReservationResponse,
} from "../types";

export const reservationsService = {
  async create(data: CreateReservationRequest): Promise<ReservationResponse> {
    const response = await apiClient.post<ReservationResponse>(
      "/api/reservations",
      data,
    );
    return response.data;
  },

  async getById(id: string): Promise<ReservationResponse> {
    const response = await apiClient.get<ReservationResponse>(
      `/api/reservations/${id}`,
    );
    return response.data;
  },

  async getActive(): Promise<ReservationResponse[]> {
    const response = await apiClient.get<ReservationResponse[]>(
      "/api/reservations/active",
    );
    return response.data;
  },

  async getMyActive(): Promise<ReservationResponse[]> {
    const response = await apiClient.get<ReservationResponse[]>(
      "/api/reservations/my",
    );
    return response.data;
  },

  async getMyHistory(): Promise<ReservationResponse[]> {
    const response = await apiClient.get<ReservationResponse[]>(
      "/api/reservations/my/history",
    );
    return response.data;
  },

  async getResourceHistory(resourceId: string): Promise<ReservationResponse[]> {
    const response = await apiClient.get<ReservationResponse[]>(
      `/api/reservations/resource/${resourceId}/history`,
    );
    return response.data;
  },

  async getResourceAvailability(
    resourceId: string,
    start: string,
    end: string,
  ): Promise<AvailabilitySlot[]> {
    const response = await apiClient.get<AvailabilitySlot[]>(
      `/api/reservations/resource/${resourceId}/availability`,
      { params: { start, end } },
    );
    return response.data;
  },

  async cancel(id: string): Promise<ReservationResponse> {
    const response = await apiClient.patch<ReservationResponse>(
      `/api/reservations/${id}/cancel`,
    );
    return response.data;
  },
};
