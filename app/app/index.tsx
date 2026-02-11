import { Redirect } from "expo-router";
import { useAuthContext } from "../src/contexts";
import { LoadingSpinner } from "../src/components";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
