import { History } from "lucide-react-native";
import { Text, View } from "react-native";

export default function HistoryScreen(): React.JSX.Element {
  return (
    <View className="flex-1 items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
      <History color="#2563eb" size={48} strokeWidth={1.75} />
      <Text className="mt-6 text-center text-2xl font-semibold text-slate-950 dark:text-slate-50">
        Histórico de consultas
      </Text>
      <Text className="mt-3 text-center text-base text-slate-600 dark:text-slate-400">
        Nenhuma consulta encontrada.
      </Text>
    </View>
  );
}
