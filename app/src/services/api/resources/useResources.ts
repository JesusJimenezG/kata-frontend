import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { resourcesService } from "./resourcesService";
import type {
  ResourceFilters,
  ResourceRequest,
  ResourceResponse,
} from "../types";

export const resourceKeys = {
  all: ["resources"] as const,
  lists: () => [...resourceKeys.all, "list"] as const,
  list: (filters?: ResourceFilters) =>
    [...resourceKeys.lists(), filters ?? {}] as const,
  details: () => [...resourceKeys.all, "detail"] as const,
  detail: (id: string) => [...resourceKeys.details(), id] as const,
};

export function useResources(filters?: ResourceFilters) {
  return useQuery<ResourceResponse[]>({
    queryKey: resourceKeys.list(filters),
    queryFn: () => resourcesService.getAll(filters),
    placeholderData: keepPreviousData,
  });
}

export function useResource(id: string) {
  return useQuery<ResourceResponse>({
    queryKey: resourceKeys.detail(id),
    queryFn: () => resourcesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateResource() {
  const queryClient = useQueryClient();

  return useMutation<ResourceResponse, Error, ResourceRequest>({
    mutationFn: (data) => resourcesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resourceKeys.lists() });
    },
  });
}

export function useUpdateResource() {
  const queryClient = useQueryClient();

  return useMutation<
    ResourceResponse,
    Error,
    { id: string; data: ResourceRequest }
  >({
    mutationFn: ({ id, data }) => resourcesService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: resourceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: resourceKeys.detail(id) });
    },
  });
}

export function useDeleteResource() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => resourcesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resourceKeys.lists() });
    },
  });
}
