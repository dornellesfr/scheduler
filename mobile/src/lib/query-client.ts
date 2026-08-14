import { isAxiosError } from "axios";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,
      retry: (failureCount: number, error: Error): boolean => {
        if (failureCount >= 2 || !isAxiosError(error)) return false;

        const status = error.response?.status;
        return status === undefined || status >= 500;
      },
    },
  },
});
