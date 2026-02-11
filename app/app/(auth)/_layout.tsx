import { Redirect, Stack } from "expo-router";
import { useAuthContext } from "../../src/contexts";

export default function AuthLayout() {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
