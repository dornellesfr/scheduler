import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function App(): React.JSX.Element {
  return (
    <View className="flex-1 items-center justify-center bg-white px-8 dark:bg-black">
      <Text className="text-4xl font-bold text-gray-900 dark:text-white">
        Scheduler
      </Text>
      <Text className="mt-3 text-center text-base text-gray-600 dark:text-gray-300">
        Your appointment scheduling app is ready.
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
