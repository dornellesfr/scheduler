import type { AppointmentStatus } from "../interfaces/Appointment";

export const appointmentStatusLabels: Record<AppointmentStatus, string> = {
  scheduled: "Agendada",
  confirmed: "Confirmada",
  completed: "Concluída",
  canceled: "Cancelada",
};

export function canCancelAppointment(status: AppointmentStatus): boolean {
  return status === "scheduled" || status === "confirmed";
}
