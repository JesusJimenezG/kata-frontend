import { apiClient } from "../client";
import type {
  ResourceFilters,
  ResourceRequest,
  ResourceResponse,
} from "../types";

export const resourcesService = {
  async getAll(filters?: ResourceFilters): Promise<ResourceResponse[]> {
    const params: Record<string, string> = {};
    if (filters?.active !== undefined) params.active = String(filters.active);
    if (filters?.typeId !== undefined) params.typeId = String(filters.typeId);

    const response = await apiClient.get<ResourceResponse[]>("/api/resources", {
      params,
    });
    return response.data;
  },

  async getById(id: string): Promise<ResourceResponse> {
    const response = await apiClient.get<ResourceResponse>(`/api/resources/${id}`);
    return response.data;
  },

  async create(data: ResourceRequest): Promise<ResourceResponse> {
    const response = await apiClient.post<ResourceResponse>("/api/resources", data);
    return response.data;
  },

  async update(id: string, data: ResourceRequest): Promise<ResourceResponse> {
    const response = await apiClient.put<ResourceResponse>(
      `/api/resources/${id}`,
      data,
    );
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/resources/${id}`);
  },
};
