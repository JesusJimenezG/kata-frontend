import { AxiosError } from "axios";
import type { ApiError } from "../services/api/types";

/**
 * Extract a user-facing error message from an Axios error or generic error.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError | undefined;
    if (apiError?.message) return apiError.message;
    if (error.response?.status === 409) return "This resource already exists";
    if (error.response?.status === 403)
      return "You don't have permission to do that";
    if (error.response?.status === 401)
      return "Session expired. Please log in again";
    return error.message || "Network error. Please try again";
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}
