import { View } from "react-native";

import { Text } from "../../../components/ui/Text";

export function HistoryEmptyState(): React.JSX.Element {
  return (
    <View className="items-center px-6 py-16">
      <Text className="text-center text-base text-slate-600 dark:text-slate-400">
        Nenhuma consulta encontrada.
      </Text>
    </View>
  );
}
