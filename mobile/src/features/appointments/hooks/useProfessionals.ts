import { useQuery } from "@tanstack/react-query";

import { appointmentsApi } from "../api/appointments.api";

export const professionalsQueryKey: readonly [string] = ["professionals"];

export function useProfessionals(specialtyId: string | null) {
  return useQuery({
    queryKey: [...professionalsQueryKey, specialtyId],
    queryFn: () => appointmentsApi.listProfessionals(specialtyId ?? ""),
    enabled: specialtyId !== null,
  });
}
