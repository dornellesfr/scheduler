import { Tabs } from "expo-router";
import { CalendarPlus, History } from "lucide-react-native";

export default function TabsLayout(): React.JSX.Element {
  return (
    <Tabs
      initialRouteName="history"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#64748b",
      }}
    >
      <Tabs.Screen
        name="history"
        options={{
          headerShown: true,
          tabBarLabel: "Histórico",
          title: "Histórico de consultas",
          tabBarIcon: ({ color, size }) => (
            <History color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          headerShown: true,
          tabBarLabel: "Agendar",
          title: "Especialidades",
          tabBarIcon: ({ color, size }) => (
            <CalendarPlus color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
