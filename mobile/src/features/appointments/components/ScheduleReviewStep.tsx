import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
  type KeyboardEvent,
} from "react-native";

import { Button } from "../../../components/ui/Button";
import { Text } from "../../../components/ui/Text";
import type {
  ScheduleProfessional,
  ScheduleSpecialty,
} from "../schemas/scheduleAppointment";
import { formatScheduleDate, getEstimatedEnd } from "../utils/scheduleDate";

interface ScheduleReviewStepProps {
  date: Date;
  isPending: boolean;
  observations: string;
  onBack: () => void;
  onConfirm: () => void;
  onObservationsChange: (observations: string) => void;
  professional: ScheduleProfessional;
  specialty: ScheduleSpecialty;
  time: string;
}

export function ScheduleReviewStep({
  date,
  isPending,
  observations,
  onBack,
  onConfirm,
  onObservationsChange,
  professional,
  specialty,
  time,
}: ScheduleReviewStepProps): React.JSX.Element {
  const estimatedEnd: Date = getEstimatedEnd(date, time);
  const scrollViewRef = useRef<ScrollView>(null);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

  useEffect(() => {
    const keyboardShowSubscription = Keyboard.addListener(
      "keyboardDidShow",
      (event: KeyboardEvent): void => {
        setKeyboardHeight(event.endCoordinates.height);
      },
    );
    const keyboardHideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      (): void => setKeyboardHeight(0),
    );

    return () => {
      keyboardShowSubscription.remove();
      keyboardHideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (keyboardHeight === 0) return;
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [keyboardHeight]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 bg-slate-50 dark:bg-slate-950"
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 24 + (Platform.OS === "android" ? keyboardHeight : 0),
          paddingHorizontal: 24,
          paddingTop: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-5 flex-row items-center">
          <Button
            accessibilityLabel="Voltar"
            className="mr-2 min-h-0 px-2 py-1"
            variant="ghost"
            onPress={onBack}
          >
            Voltar
          </Button>
        </View>
        <View className="gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
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
              Data
            </Text>
            <Text className="mt-1 text-base text-slate-950 dark:text-slate-50">
              {formatScheduleDate(date)}
            </Text>
          </View>
          <View>
            <Text className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
              Horário
            </Text>
            <Text className="mt-1 text-base text-slate-950 dark:text-slate-50">
              {time} às {format(estimatedEnd, "HH:mm")}
            </Text>
          </View>
        </View>
        <Text className="mb-2 mt-5 text-sm font-medium text-slate-700 dark:text-slate-300">
          Observações (opcional)
        </Text>
        <TextInput
          accessibilityLabel="Observações (opcional)"
          className="min-h-28 rounded-xl border border-slate-300 bg-white p-4 text-base text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
          multiline
          numberOfLines={4}
          placeholder="Adicione uma observação"
          placeholderTextColor="#94a3b8"
          textAlignVertical="top"
          value={observations}
          onChangeText={onObservationsChange}
        />
        <Button className="mt-5" loading={isPending} onPress={onConfirm}>
          Confirmar agendamento
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
