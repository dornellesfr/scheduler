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
          <Text className="font-medium text-slate-500 dark:text-slate-400 text-xs uppercase">
            Profissional
          </Text>
          <Text className="mt-1 text-slate-950 dark:text-slate-50 text-base">
            {appointment.professional?.name ?? "Profissional não informado"}
          </Text>
        </View>
        <View>
          <Text className="font-medium text-slate-500 dark:text-slate-400 text-xs uppercase">
            Especialidade
          </Text>
          <Text className="mt-1 text-slate-950 dark:text-slate-50 text-base">
            {appointment.specialty?.name ?? "Especialidade não informada"}
          </Text>
        </View>
        <View>
          <Text className="font-medium text-slate-500 dark:text-slate-400 text-xs uppercase">
            Data e hora
          </Text>
          <Text className="mt-1 text-slate-950 dark:text-slate-50 text-base">
            {formatAppointmentDate(appointment.scheduled_at)}
          </Text>
        </View>
        <View>
          <Text className="mb-1 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase">
            Status
          </Text>
          <StatusBadge status={appointment.status} />
        </View>
        {appointment.observations ? (
          <View>
            <Text className="font-medium text-slate-500 dark:text-slate-400 text-xs uppercase">
              Observações
            </Text>
            <Text className="mt-1 text-slate-950 dark:text-slate-50 text-base">
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
