import { View } from "react-native";

import { Button } from "../../../components/ui/Button";
import { Text } from "../../../components/ui/Text";

interface ScheduleErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ScheduleErrorState({
  message,
  onRetry,
}: ScheduleErrorStateProps): React.JSX.Element {
  return (
    <View className="items-center px-6 py-16">
      <Text className="text-center text-base font-medium text-slate-900 dark:text-slate-50">
        {message}
      </Text>
      <Text className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
        Tente novamente em instantes.
      </Text>
      <Button className="mt-5" onPress={onRetry}>
        Tentar novamente
      </Button>
    </View>
  );
}
