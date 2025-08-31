import type { AxiosError } from "axios";

export function getAxiosErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<{ error_message?: string }>;
  return axiosError.response?.data?.error_message || "Unknown error";
}
