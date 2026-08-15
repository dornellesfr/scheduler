import { View } from "react-native";

import { Button } from "../../../components/ui/Button";
import { Text } from "../../../components/ui/Text";

interface HistoryErrorStateProps {
  onRetry: () => void;
}

export function HistoryErrorState({
  onRetry,
}: HistoryErrorStateProps): React.JSX.Element {
  return (
    <View className="items-center px-6 py-16">
      <Text className="text-center text-base font-medium text-slate-900 dark:text-slate-50">
        Não foi possível carregar suas consultas.
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
