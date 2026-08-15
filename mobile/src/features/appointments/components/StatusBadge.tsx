import { View } from "react-native";

import { Text } from "../../../components/ui/Text";
import type { AppointmentStatus } from "../interfaces/Appointment";
import { appointmentStatusLabels } from "../utils/appointmentStatus";

interface StatusBadgeProps {
  status: AppointmentStatus;
}

const badgeClasses: Record<AppointmentStatus, string> = {
  scheduled: "bg-blue-100 dark:bg-blue-950",
  confirmed: "bg-indigo-100 dark:bg-indigo-950",
  completed: "bg-emerald-100 dark:bg-emerald-950",
  canceled: "bg-slate-200 dark:bg-slate-800",
};

const badgeTextClasses: Record<AppointmentStatus, string> = {
  scheduled: "text-blue-700 dark:text-blue-300",
  confirmed: "text-indigo-700 dark:text-indigo-300",
  completed: "text-emerald-700 dark:text-emerald-300",
  canceled: "text-slate-700 dark:text-slate-300",
};

export function StatusBadge({ status }: StatusBadgeProps): React.JSX.Element {
  return (
    <View
      className={`self-start rounded-full px-3 py-1 ${badgeClasses[status]}`}
    >
      <Text className={`text-xs font-semibold ${badgeTextClasses[status]}`}>
        {appointmentStatusLabels[status]}
      </Text>
    </View>
  );
}
