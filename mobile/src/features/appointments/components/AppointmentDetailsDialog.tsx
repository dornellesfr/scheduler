import { View } from "react-native";

import { Button } from "../../../components/ui/Button";
import { Dialog } from "../../../components/ui/Dialog";
import { Text } from "../../../components/ui/Text";
import type { Appointment } from "../interfaces/Appointment";
import { canCancelAppointment } from "../utils/appointmentStatus";
import { formatAppointmentDate } from "../utils/formatAppointmentDate";
import { StatusBadge } from "./StatusBadge";

interface AppointmentDetailsDialogProps {
  appointment: Appointment | null;
  onCancel: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function AppointmentDetailsDialog({
  appointment,
  onCancel,
  onOpenChange,
  open,
}: AppointmentDetailsDialogProps): React.JSX.Element {
  if (!appointment) return <></>;

  return (
    <Dialog
      open={open}
      title="Detalhes da consulta"
      onOpenChange={onOpenChange}
    >
      <View className="gap-4">
        <View>
          <Text className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
            Profissional
          </Text>
          <Text className="mt-1 text-base text-slate-950 dark:text-slate-50">
            {appointment.professional?.name ?? "Profissional não informado"}
          </Text>
        </View>
        <View>
          <Text className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
            Especialidade
          </Text>
          <Text className="mt-1 text-base text-slate-950 dark:text-slate-50">
            {appointment.specialty?.name ?? "Especialidade não informada"}
          </Text>
        </View>
        <View>
          <Text className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
            Data e hora
          </Text>
          <Text className="mt-1 text-base text-slate-950 dark:text-slate-50">
            {formatAppointmentDate(appointment.scheduled_at)}
          </Text>
        </View>
        <View>
          <Text className="mb-1 text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
            Status
          </Text>
          <StatusBadge status={appointment.status} />
        </View>
        {appointment.observations ? (
          <View>
            <Text className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
              Observações
            </Text>
            <Text className="mt-1 text-base text-slate-950 dark:text-slate-50">
              {appointment.observations}
            </Text>
          </View>
        ) : null}
        {canCancelAppointment(appointment.status) ? (
          <Button variant="destructive" onPress={onCancel}>
            Cancelar consulta
          </Button>
        ) : null}
      </View>
    </Dialog>
  );
}
