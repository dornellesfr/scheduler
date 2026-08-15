import { format } from "date-fns";
import { View } from "react-native";

import { Button } from "../../../components/ui/Button";
import { Text } from "../../../components/ui/Text";
import type {
  ScheduleProfessional,
  ScheduleSpecialty,
} from "../schemas/scheduleAppointment";
import { formatScheduleDate, getEstimatedEnd } from "../utils/scheduleDate";

interface ScheduleSuccessProps {
  date: Date;
  onScheduleAnother: () => void;
  onViewHistory: () => void;
  professional: ScheduleProfessional;
  specialty: ScheduleSpecialty;
  time: string;
}

export function ScheduleSuccess({
  date,
  onScheduleAnother,
  onViewHistory,
  professional,
  specialty,
  time,
}: ScheduleSuccessProps): React.JSX.Element {
  const estimatedEnd: Date = getEstimatedEnd(date, time);

  return (
    <View className="flex-1 bg-slate-50 px-6 pt-6 dark:bg-slate-950">
      <View className="flex-1 justify-center">
        <Text className="text-center text-2xl font-semibold text-slate-950 dark:text-slate-50">
          Consulta agendada com sucesso.
        </Text>
        <View className="mt-6 gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <View>
            <Text className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
              Especialidade
            </Text>
            <Text className="mt-1 text-base text-slate-950 dark:text-slate-50">
              {specialty.name}
            </Text>
          </View>
          <View>
            <Text className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
              Profissional
            </Text>
            <Text className="mt-1 text-base text-slate-950 dark:text-slate-50">
              {professional.name}
            </Text>
          </View>
          <View>
            <Text className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
              Data e horário
            </Text>
            <Text className="mt-1 text-base text-slate-950 dark:text-slate-50">
              {formatScheduleDate(date)} · {time} às{" "}
              {format(estimatedEnd, "HH:mm")}
            </Text>
          </View>
        </View>
      </View>
      <View className="gap-3 pb-6">
        <Button onPress={onViewHistory}>Ver no histórico</Button>
        <Button variant="outline" onPress={onScheduleAnother}>
          Agendar outra
        </Button>
      </View>
    </View>
  );
}
