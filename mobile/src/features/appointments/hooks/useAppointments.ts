import { useQuery } from "@tanstack/react-query";

import { appointmentsApi } from "../api/appointments.api";
import type { AppointmentStatus } from "../interfaces/Appointment";

export const appointmentsQueryKey: readonly [string] = ["appointments"];

export function useAppointments(status: AppointmentStatus | null) {
  return useQuery({
    queryKey: [...appointmentsQueryKey, status],
    queryFn: () => appointmentsApi.list(status ? { status } : {}),
  });
}
