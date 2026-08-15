import { FlashList } from "@shopify/flash-list";
import { Pressable, View } from "react-native";

import { Text } from "../../../components/ui/Text";
import type { ScheduleSpecialty } from "../schemas/scheduleAppointment";
import { ScheduleEmptyState } from "./ScheduleEmptyState";
import { ScheduleErrorState } from "./ScheduleErrorState";
import { ScheduleLoadingState } from "./ScheduleLoadingState";

interface ScheduleSpecialtyListProps {
  data: ScheduleSpecialty[] | undefined;
  isError: boolean;
  isPending: boolean;
  onRetry: () => void;
  onSelect: (specialty: ScheduleSpecialty) => void;
}

export function ScheduleSpecialtyList({
  data,
  isError,
  isPending,
  onRetry,
  onSelect,
}: ScheduleSpecialtyListProps): React.JSX.Element {
  return (
    <View className="flex-1 bg-slate-50 px-6 pt-6 dark:bg-slate-950">
      <Text className="mb-5 text-2xl font-semibold text-slate-950 dark:text-slate-50">
        Especialidade
      </Text>
      {isPending && !data ? (
        <ScheduleLoadingState message="Carregando especialidades..." />
      ) : null}
      {isError ? (
        <ScheduleErrorState
          message="Não foi possível carregar as especialidades."
          onRetry={onRetry}
        />
      ) : null}
      {data && !isError && data.length === 0 ? (
        <ScheduleEmptyState message="Nenhuma especialidade encontrada." />
      ) : null}
      {data && !isError && data.length > 0 ? (
        <FlashList
          contentContainerStyle={{ paddingBottom: 24 }}
          data={data}
          keyExtractor={(item: ScheduleSpecialty) => item.id}
          renderItem={({ item }: { item: ScheduleSpecialty }) => (
            <Pressable
              accessibilityLabel={`Especialidade ${item.name}`}
              accessibilityRole="button"
              className="mb-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              onPress={() => onSelect(item)}
            >
              <Text className="text-base font-semibold text-slate-950 dark:text-slate-50">
                {item.name}
              </Text>
            </Pressable>
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : null}
    </View>
  );
}
