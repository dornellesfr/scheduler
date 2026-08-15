import { useQuery } from "@tanstack/react-query";

import { appointmentsApi } from "../api/appointments.api";

export const specialtiesQueryKey: readonly [string] = ["specialties"];

export function useSpecialties() {
  return useQuery({
    queryKey: specialtiesQueryKey,
    queryFn: appointmentsApi.listSpecialties,
  });
}
