import { useMutation, useQueryClient } from "@tanstack/react-query";

import { appointmentsApi } from "../api/appointments.api";
import { appointmentsQueryKey } from "./useAppointments";

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appointmentsApi.cancel(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: appointmentsQueryKey });
    },
  });
}
