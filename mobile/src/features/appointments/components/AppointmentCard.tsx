import { Pressable, View } from "react-native";

import { Text } from "../../../components/ui/Text";
import type { Appointment } from "../interfaces/Appointment";
import { formatAppointmentDate } from "../utils/formatAppointmentDate";
import { StatusBadge } from "./StatusBadge";

interface AppointmentCardProps {
  appointment: Appointment;
  onPress: (appointment: Appointment) => void;
}

export function AppointmentCard({
  appointment,
  onPress,
}: AppointmentCardProps): React.JSX.Element {
  return (
    <Pressable
      accessibilityLabel={`Consulta com ${appointment.professional?.name ?? "profissional não informado"}`}
      accessibilityRole="button"
      className="mb-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
      onPress={() => onPress(appointment)}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-base font-semibold text-slate-950 dark:text-slate-50">
            {appointment.professional?.name ?? "Profissional não informado"}
          </Text>
          <Text className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {appointment.specialty?.name ?? "Especialidade não informada"}
          </Text>
        </View>
        <StatusBadge status={appointment.status} />
      </View>
      <Text className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-300">
        {formatAppointmentDate(appointment.scheduled_at)}
      </Text>
    </Pressable>
  );
}
