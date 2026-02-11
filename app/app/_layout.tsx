import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../src/contexts";
import "../global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="resource/[id]"
            options={{ headerShown: true, title: "Resource Details" }}
          />
          <Stack.Screen
            name="reservation/new"
            options={{ headerShown: true, title: "New Reservation", presentation: "modal" }}
          />
          <Stack.Screen
            name="resource/new"
            options={{ headerShown: true, title: "New Resource", presentation: "modal" }}
          />
          <Stack.Screen
            name="resource/edit/[id]"
            options={{ headerShown: true, title: "Edit Resource", presentation: "modal" }}
          />
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  );
}
