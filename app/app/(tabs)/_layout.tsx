import { Redirect, Tabs } from "expo-router";
import { Text } from "react-native";
import { useAuthContext } from "../../src/contexts";

export default function TabsLayout() {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#FFFFFF" },
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: "700", fontSize: 18 },
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#F3F4F6",
          paddingBottom: 4,
          height: 56,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Resources",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>📦</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="reservations"
        options={{
          title: "Reservations",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>📅</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>👤</Text>
          ),
        }}
      />
    </Tabs>
  );
}
