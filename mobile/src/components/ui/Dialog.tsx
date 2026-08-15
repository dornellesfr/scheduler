import { Modal, Pressable, View } from "react-native";

import { Button } from "./Button";
import { Text } from "./Text";

interface DialogProps {
  children: React.ReactNode;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: string;
}

export function Dialog({
  children,
  onOpenChange,
  open,
  title,
}: DialogProps): React.JSX.Element {
  if (!open) return <></>;

  return (
    <Modal
      accessibilityViewIsModal
      animationType="fade"
      transparent
      visible={open}
      onRequestClose={() => onOpenChange(false)}
    >
      <View className="flex-1 items-center justify-center px-6">
        <Pressable
          accessibilityLabel="Fechar diálogo"
          className="absolute inset-0 bg-black/50"
          onPress={() => onOpenChange(false)}
        />
        <View className="w-full rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <View className="mb-5 flex-row items-start justify-between gap-4">
            <Text className="flex-1 text-xl font-semibold text-slate-950 dark:text-slate-50">
              {title}
            </Text>
            <Button
              accessibilityLabel="Fechar diálogo"
              className="min-h-0 px-2 py-1"
              variant="ghost"
              onPress={() => onOpenChange(false)}
            >
              Fechar
            </Button>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}
