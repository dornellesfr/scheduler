import { View } from "react-native";

import { Button } from "../../../components/ui/Button";
import { Dialog } from "../../../components/ui/Dialog";
import { Text } from "../../../components/ui/Text";
import type { Appointment } from "../interfaces/Appointment";

interface CancelAppointmentDialogProps {
  appointment: Appointment | null;
  error: boolean;
  isPending: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function CancelAppointmentDialog({
  appointment,
  error,
  isPending,
  onConfirm,
  onOpenChange,
  open,
}: CancelAppointmentDialogProps): React.JSX.Element {
  if (!appointment) return <></>;

  return (
    <Dialog open={open} title="Cancelar consulta?" onOpenChange={onOpenChange}>
      <View>
        <Text className="text-base leading-6 text-slate-700 dark:text-slate-300">
          Essa ação não pode ser desfeita. Deseja cancelar a consulta com{" "}
          {appointment.professional?.name ?? "este profissional"}?
        </Text>
        {error ? (
          <Text className="mt-4 text-sm font-medium text-red-600 dark:text-red-400">
            Não foi possível cancelar a consulta. Tente novamente.
          </Text>
        ) : null}
        <View className="mt-6 flex-row justify-end gap-3">
          <Button
            className="flex-1"
            disabled={isPending}
            variant="outline"
            onPress={() => onOpenChange(false)}
          >
            Manter consulta
          </Button>
          <Button
            className="flex-1"
            loading={isPending}
            variant="destructive"
            onPress={onConfirm}
          >
            Confirmar cancelamento
          </Button>
        </View>
      </View>
    </Dialog>
  );
}
