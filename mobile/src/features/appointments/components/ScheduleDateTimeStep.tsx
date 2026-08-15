import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import { Pressable, View } from "react-native";

import { Button } from "../../../components/ui/Button";
import { Text } from "../../../components/ui/Text";
import {
  formatScheduleDate,
  getAvailableScheduleTimes,
  getScheduleDateRange,
} from "../utils/scheduleDate";
import { ScheduleEmptyState } from "./ScheduleEmptyState";

interface ScheduleDateTimeStepProps {
  onBack: () => void;
  onDateChange: (date: Date) => void;
  onSelectTime: (time: string) => void;
  selectedDate: Date;
}

export function ScheduleDateTimeStep({
  onBack,
  onDateChange,
  onSelectTime,
  selectedDate,
}: ScheduleDateTimeStepProps): React.JSX.Element {
  const [isDatePickerVisible, setIsDatePickerVisible] =
    useState<boolean>(false);
  const { maxDate, minDate } = getScheduleDateRange();
  const availableTimes: string[] = getAvailableScheduleTimes(selectedDate);

  function handleDateChange(
    event: DateTimePickerEvent,
    date: Date | undefined,
  ): void {
    setIsDatePickerVisible(false);
    if (event.type === "dismissed" || !date) return;

    onDateChange(date);
  }

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
          Passo 2 de 3 · Data e horário
        </Text>
      </View>
      <Button
        className="mb-3 self-start"
        variant="outline"
        onPress={() => setIsDatePickerVisible(true)}
      >
        Escolher data: {formatScheduleDate(selectedDate)}
      </Button>
      {isDatePickerVisible ? (
        <DateTimePicker
          maximumDate={maxDate}
          minimumDate={minDate}
          mode="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      ) : null}
      <Text className="mb-3 mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
        Horários disponíveis
      </Text>
      {availableTimes.length === 0 ? (
        <ScheduleEmptyState message="Nenhum horário futuro disponível nesta data." />
      ) : (
        <FlashList
          contentContainerStyle={{ paddingBottom: 24 }}
          data={availableTimes}
          keyExtractor={(item: string) => item}
          renderItem={({ item }: { item: string }) => (
            <Pressable
              accessibilityLabel={`Horário ${item}`}
              accessibilityRole="button"
              className="mb-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              onPress={() => onSelectTime(item)}
            >
              <Text className="text-center text-base font-semibold text-slate-950 dark:text-slate-50">
                {item}
              </Text>
            </Pressable>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
