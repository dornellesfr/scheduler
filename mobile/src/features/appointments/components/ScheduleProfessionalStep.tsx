import { FlashList } from "@shopify/flash-list";
import { Pressable, View } from "react-native";

import { Button } from "../../../components/ui/Button";
import { Text } from "../../../components/ui/Text";
import type {
  ScheduleProfessional,
  ScheduleSpecialty,
} from "../schemas/scheduleAppointment";
import { ScheduleEmptyState } from "./ScheduleEmptyState";
import { ScheduleErrorState } from "./ScheduleErrorState";
import { ScheduleLoadingState } from "./ScheduleLoadingState";

interface ScheduleProfessionalStepProps {
  data: ScheduleProfessional[] | undefined;
  isError: boolean;
  isPending: boolean;
  onBack: () => void;
  onRetry: () => void;
  onSelect: (professional: ScheduleProfessional) => void;
  specialty: ScheduleSpecialty;
}

export function ScheduleProfessionalStep({
  data,
  isError,
  isPending,
  onBack,
  onRetry,
  onSelect,
  specialty,
}: ScheduleProfessionalStepProps): React.JSX.Element {
  return (
    <View className="flex-1 bg-slate-50 px-6 pt-6 dark:bg-slate-950">
      <View className="mb-4 flex-row items-center">
        <Button
          accessibilityLabel="Voltar"
          className="mr-2 min-h-0 px-2 py-1"
          variant="ghost"
          onPress={onBack}
        >
          Voltar
        </Button>
        <Text className="flex-1 text-xl font-semibold text-slate-950 dark:text-slate-50">
          Passo 1 de 3 · Profissional
        </Text>
      </View>
      <Text className="mb-5 text-sm text-slate-600 dark:text-slate-400">
        {specialty.name}
      </Text>
      {isPending && !data ? (
        <ScheduleLoadingState message="Carregando profissionais..." />
      ) : null}
      {isError ? (
        <ScheduleErrorState
          message="Não foi possível carregar os profissionais."
          onRetry={onRetry}
        />
      ) : null}
      {data && !isError && data.length === 0 ? (
        <ScheduleEmptyState message="Nenhum profissional encontrado." />
      ) : null}
      {data && !isError && data.length > 0 ? (
        <FlashList
          contentContainerStyle={{ paddingBottom: 24 }}
          data={data}
          keyExtractor={(item: ScheduleProfessional) => item.id}
          renderItem={({ item }: { item: ScheduleProfessional }) => (
            <Pressable
              accessibilityLabel={`Profissional ${item.name}`}
              accessibilityRole="button"
              className="mb-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              onPress={() => onSelect(item)}
            >
              <Text className="text-base font-semibold text-slate-950 dark:text-slate-50">
                {item.name}
              </Text>
              <Text className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {specialty.name}
              </Text>
            </Pressable>
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : null}
    </View>
  );
}
