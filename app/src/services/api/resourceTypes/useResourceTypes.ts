import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { resourceTypesService } from "./resourceTypesService";
import type { ResourceTypeRequest, ResourceTypeResponse } from "../types";

export const resourceTypeKeys = {
  all: ["resourceTypes"] as const,
  lists: () => [...resourceTypeKeys.all, "list"] as const,
  detail: (id: number) => [...resourceTypeKeys.all, "detail", id] as const,
};

export function useResourceTypes() {
  return useQuery<ResourceTypeResponse[]>({
    queryKey: resourceTypeKeys.lists(),
    queryFn: () => resourceTypesService.getAll(),
  });
}

export function useResourceType(id: number) {
  return useQuery<ResourceTypeResponse>({
    queryKey: resourceTypeKeys.detail(id),
    queryFn: () => resourceTypesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateResourceType() {
  const queryClient = useQueryClient();

  return useMutation<ResourceTypeResponse, Error, ResourceTypeRequest>({
    mutationFn: (data) => resourceTypesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resourceTypeKeys.lists() });
    },
  });
}

export function useUpdateResourceType() {
  const queryClient = useQueryClient();

  return useMutation<
    ResourceTypeResponse,
    Error,
    { id: number; data: ResourceTypeRequest }
  >({
    mutationFn: ({ id, data }) => resourceTypesService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: resourceTypeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: resourceTypeKeys.detail(id) });
    },
  });
}

export function useDeleteResourceType() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => resourceTypesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resourceTypeKeys.lists() });
    },
  });
}
