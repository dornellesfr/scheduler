import { View } from "react-native";

import { Text } from "../../../components/ui/Text";

interface ScheduleEmptyStateProps {
  message: string;
}

export function ScheduleEmptyState({
  message,
}: ScheduleEmptyStateProps): React.JSX.Element {
  return (
    <View className="items-center px-6 py-16">
      <Text className="text-center text-base text-slate-600 dark:text-slate-400">
        {message}
      </Text>
    </View>
  );
}
