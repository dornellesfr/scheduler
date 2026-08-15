import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import { View } from "react-native";

import { AppointmentCard } from "../../features/appointments/components/AppointmentCard";
import { AppointmentDetailsDialog } from "../../features/appointments/components/AppointmentDetailsDialog";
import { CancelAppointmentDialog } from "../../features/appointments/components/CancelAppointmentDialog";
import { FilterChips } from "../../features/appointments/components/FilterChips";
import { HistoryEmptyState } from "../../features/appointments/components/HistoryEmptyState";
import { HistoryErrorState } from "../../features/appointments/components/HistoryErrorState";
import { HistoryLoadingState } from "../../features/appointments/components/HistoryLoadingState";
import { useAppointments } from "../../features/appointments/hooks/useAppointments";
import { useCancelAppointment } from "../../features/appointments/hooks/useCancelAppointment";
import type {
  Appointment,
  AppointmentStatus,
} from "../../features/appointments/interfaces/Appointment";

export default function HistoryScreen(): React.JSX.Element {
  const [selectedStatus, setSelectedStatus] =
    useState<AppointmentStatus | null>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState<boolean>(false);
  const { data, isError, isPending, refetch } = useAppointments(selectedStatus);
  const cancelAppointment = useCancelAppointment();

  function handleDetailsOpenChange(open: boolean): void {
    if (open) return;

    setIsCancelDialogOpen(false);
    setSelectedAppointment(null);
  }

  function handleRequestCancellation(): void {
    cancelAppointment.reset();
    setIsCancelDialogOpen(true);
  }

  function handleConfirmCancellation(): void {
    if (!selectedAppointment) return;

    cancelAppointment.mutate(selectedAppointment.id, {
      onSuccess: (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setIsCancelDialogOpen(false);
      },
    });
  }

  const hasData: boolean = data !== undefined;

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950 px-6 pt-6">
      <FilterChips
        selectedStatus={selectedStatus}
        onSelect={setSelectedStatus}
      />
      {isPending && !hasData ? <HistoryLoadingState /> : null}
      {isError && !hasData ? (
        <HistoryErrorState onRetry={() => refetch()} />
      ) : null}
      {hasData && !isError ? (
        <FlashList
          contentContainerStyle={{ paddingBottom: 24 }}
          data={data}
          keyExtractor={(item: Appointment) => item.id}
          ListEmptyComponent={<HistoryEmptyState />}
          renderItem={({ item }: { item: Appointment }) => (
            <AppointmentCard
              appointment={item}
              onPress={setSelectedAppointment}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : null}
      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        open={selectedAppointment !== null}
        onCancel={handleRequestCancellation}
        onOpenChange={handleDetailsOpenChange}
      />
      <CancelAppointmentDialog
        appointment={selectedAppointment}
        error={cancelAppointment.isError}
        isPending={cancelAppointment.isPending}
        open={isCancelDialogOpen}
        onConfirm={handleConfirmCancellation}
        onOpenChange={setIsCancelDialogOpen}
      />
    </View>
  );
}
