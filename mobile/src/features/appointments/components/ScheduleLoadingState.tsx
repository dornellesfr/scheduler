import { ActivityIndicator, View } from "react-native";

import { Text } from "../../../components/ui/Text";

interface ScheduleLoadingStateProps {
  message: string;
}

export function ScheduleLoadingState({
  message,
}: ScheduleLoadingStateProps): React.JSX.Element {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <ActivityIndicator color="#2563eb" />
      <Text className="mt-4 text-center text-base text-slate-600 dark:text-slate-400">
        {message}
      </Text>
    </View>
  );
}
