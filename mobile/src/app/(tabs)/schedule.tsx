import { useFocusEffect, useRouter } from "expo-router";
import { startOfDay } from "date-fns";
import { useCallback, useState } from "react";
import { BackHandler, View } from "react-native";

import { Dialog } from "../../components/ui/Dialog";
import { Text } from "../../components/ui/Text";
import { ScheduleDateTimeStep } from "../../features/appointments/components/ScheduleDateTimeStep";
import { ScheduleProfessionalStep } from "../../features/appointments/components/ScheduleProfessionalStep";
import { ScheduleReviewStep } from "../../features/appointments/components/ScheduleReviewStep";
import { ScheduleSpecialtyList } from "../../features/appointments/components/ScheduleSpecialtyList";
import { ScheduleSuccess } from "../../features/appointments/components/ScheduleSuccess";
import { useCreateAppointment } from "../../features/appointments/hooks/useCreateAppointment";
import { useProfessionals } from "../../features/appointments/hooks/useProfessionals";
import { useSpecialties } from "../../features/appointments/hooks/useSpecialties";
import type {
  CreateAppointmentPayload,
  ScheduleDraft,
  ScheduleProfessional,
  ScheduleSpecialty,
} from "../../features/appointments/schemas/scheduleAppointment";
import { getAppointmentErrorMessage } from "../../features/appointments/utils/appointmentError";
import {
  formatScheduledAt,
  getScheduleDateRange,
} from "../../features/appointments/utils/scheduleDate";

const DEMO_PATIENT_ID: string = "00000000-0000-4000-8000-000000000001";

type ScheduleView =
  | "specialty_list"
  | "wizard_professional"
  | "wizard_datetime"
  | "wizard_review"
  | "success";

export default function ScheduleScreen(): React.JSX.Element {
  const router = useRouter();
  const [screen, setScreen] = useState<ScheduleView>("specialty_list");
  const [draft, setDraft] = useState<ScheduleDraft | null>(null);
  const [isCreateErrorDialogOpen, setIsCreateErrorDialogOpen] =
    useState<boolean>(false);
  const specialties = useSpecialties();
  const professionals = useProfessionals(draft?.specialty.id ?? null);
  const createAppointment = useCreateAppointment();

  function resetSchedule(): void {
    createAppointment.reset();
    setIsCreateErrorDialogOpen(false);
    setDraft(null);
    setScreen("specialty_list");
  }

  const handleBack = useCallback((): void => {
    if (screen === "wizard_review") {
      createAppointment.reset();
      setIsCreateErrorDialogOpen(false);
      setScreen("wizard_datetime");
      return;
    }

    if (screen === "wizard_datetime") {
      setScreen("wizard_professional");
      return;
    }

    if (screen === "wizard_professional") {
      createAppointment.reset();
      setIsCreateErrorDialogOpen(false);
      setDraft(null);
      setScreen("specialty_list");
    }
  }, [createAppointment, screen]);

  useFocusEffect(
    useCallback(() => {
      if (screen === "specialty_list" || screen === "success") {
        return undefined;
      }

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          handleBack();
          return true;
        },
      );

      return () => subscription.remove();
    }, [handleBack, screen]),
  );

  function handleSpecialtySelect(specialty: ScheduleSpecialty): void {
    setDraft({
      date: getScheduleDateRange().minDate,
      observations: "",
      professional: null,
      specialty,
      time: null,
    });
    setScreen("wizard_professional");
  }

  function handleProfessionalSelect(professional: ScheduleProfessional): void {
    setDraft((currentDraft: ScheduleDraft | null) =>
      currentDraft ? { ...currentDraft, professional } : currentDraft,
    );
    setScreen("wizard_datetime");
  }

  function handleDateChange(date: Date): void {
    setDraft((currentDraft: ScheduleDraft | null) =>
      currentDraft
        ? { ...currentDraft, date: startOfDay(date), time: null }
        : currentDraft,
    );
  }

  function handleTimeSelect(time: string): void {
    setDraft((currentDraft: ScheduleDraft | null) =>
      currentDraft ? { ...currentDraft, time } : currentDraft,
    );
    setScreen("wizard_review");
  }

  function handleConfirmAppointment(): void {
    if (!draft?.professional || !draft.time) return;

    const observations: string = draft.observations.trim();
    const payload: CreateAppointmentPayload = {
      patient_id: DEMO_PATIENT_ID,
      professional_id: draft.professional.id,
      scheduled_at: formatScheduledAt(draft.date, draft.time),
      ...(observations ? { observations } : {}),
    };

    createAppointment.mutate(payload, {
      onError: () => setIsCreateErrorDialogOpen(true),
      onSuccess: () => setScreen("success"),
    });
  }

  function handleViewHistory(): void {
    resetSchedule();
    router.replace("/(tabs)/history");
  }

  if (screen === "specialty_list") {
    return (
      <ScheduleSpecialtyList
        data={specialties.data}
        isError={specialties.isError}
        isPending={specialties.isPending}
        onRetry={() => specialties.refetch()}
        onSelect={handleSpecialtySelect}
      />
    );
  }

  if (!draft) {
    return <View className="flex-1 bg-slate-50 dark:bg-slate-950" />;
  }

  if (screen === "wizard_professional") {
    return (
      <ScheduleProfessionalStep
        data={professionals.data}
        isError={professionals.isError}
        isPending={professionals.isPending}
        onBack={handleBack}
        onRetry={() => professionals.refetch()}
        onSelect={handleProfessionalSelect}
        specialty={draft.specialty}
      />
    );
  }

  if (screen === "wizard_datetime") {
    return (
      <ScheduleDateTimeStep
        onBack={handleBack}
        onDateChange={handleDateChange}
        onSelectTime={handleTimeSelect}
        selectedDate={draft.date}
      />
    );
  }

  if (screen === "wizard_review" && draft.professional && draft.time) {
    return (
      <>
        <ScheduleReviewStep
          date={draft.date}
          isPending={createAppointment.isPending}
          observations={draft.observations}
          onBack={handleBack}
          onConfirm={handleConfirmAppointment}
          onObservationsChange={(observations: string) =>
            setDraft((currentDraft: ScheduleDraft | null) =>
              currentDraft ? { ...currentDraft, observations } : currentDraft,
            )
          }
          professional={draft.professional}
          specialty={draft.specialty}
          time={draft.time}
        />
        <Dialog
          open={isCreateErrorDialogOpen}
          title="Não foi possível agendar"
          onOpenChange={(open: boolean) => {
            if (!open) {
              createAppointment.reset();
              setIsCreateErrorDialogOpen(false);
            }
          }}
        >
          <Text className="text-base leading-6 text-slate-700 dark:text-slate-300">
            {getAppointmentErrorMessage(createAppointment.error)}
          </Text>
        </Dialog>
      </>
    );
  }

  if (screen === "success" && draft.professional && draft.time) {
    return (
      <ScheduleSuccess
        date={draft.date}
        onScheduleAnother={resetSchedule}
        onViewHistory={handleViewHistory}
        professional={draft.professional}
        specialty={draft.specialty}
        time={draft.time}
      />
    );
  }

  return <View className="flex-1 bg-slate-50 dark:bg-slate-950" />;
}
