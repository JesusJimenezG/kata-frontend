import { apiClient } from "../client";
import type { ResourceTypeRequest, ResourceTypeResponse } from "../types";

export const resourceTypesService = {
  async getAll(): Promise<ResourceTypeResponse[]> {
    const response = await apiClient.get<ResourceTypeResponse[]>("/api/resource-types");
    return response.data;
  },

  async getById(id: number): Promise<ResourceTypeResponse> {
    const response = await apiClient.get<ResourceTypeResponse>(
      `/api/resource-types/${id}`,
    );
    return response.data;
  },

  async create(data: ResourceTypeRequest): Promise<ResourceTypeResponse> {
    const response = await apiClient.post<ResourceTypeResponse>(
      "/api/resource-types",
      data,
    );
    return response.data;
  },

  async update(id: number, data: ResourceTypeRequest): Promise<ResourceTypeResponse> {
    const response = await apiClient.put<ResourceTypeResponse>(
      `/api/resource-types/${id}`,
      data,
    );
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/resource-types/${id}`);
  },
};
