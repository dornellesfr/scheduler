import { useMutation, useQueryClient } from "@tanstack/react-query";

import { appointmentsApi } from "../api/appointments.api";
import type { CreateAppointmentPayload } from "../schemas/scheduleAppointment";
import { appointmentsQueryKey } from "./useAppointments";

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAppointmentPayload) =>
      appointmentsApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: appointmentsQueryKey });
    },
  });
}
