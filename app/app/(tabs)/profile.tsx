import { Alert, Pressable, Text, View } from "react-native";
import { router } from "expo-router";

import { Button, Card, Divider } from "../../src/components";
import { useAuthContext } from "../../src/contexts";
import { useLogout } from "../../src/services/api/auth";
import { useMyActiveReservations, useMyReservationHistory } from "../../src/services/api/reservations";
import { getErrorMessage } from "../../src/utils";

export default function ProfileScreen() {
  const { userEmail, isAdmin, signOut, setAdmin } = useAuthContext();
  const logoutMutation = useLogout();

  const { data: myActive } = useMyActiveReservations();
  const { data: myHistory } = useMyReservationHistory();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: async () => {
        await signOut();
        router.replace("/(auth)/login");
      },
      onError: async (err) => {
        // Even on error, clear local tokens and redirect
        await signOut();
        router.replace("/(auth)/login");
      },
    });
  };

  return (
    <View className="flex-1 bg-gray-50 p-4">
      {/* User Info Card */}
      <Card>
        <View className="items-center py-4">
          <View className="w-16 h-16 rounded-full bg-blue-100 items-center justify-center mb-3">
            <Text className="text-2xl">👤</Text>
          </View>
          <Text className="text-lg font-bold text-gray-900">{userEmail}</Text>
          <Text className="text-sm text-gray-500 mt-1">
            {isAdmin ? "Administrator" : "User"}
          </Text>
        </View>
      </Card>

      {/* Stats Card */}
      <View className="mt-4">
        <Card>
          <View className="flex-row">
            <View className="flex-1 items-center py-2">
              <Text className="text-2xl font-bold text-blue-600">
                {myActive?.length ?? 0}
              </Text>
              <Text className="text-xs text-gray-500 mt-1">
                Active Reservations
              </Text>
            </View>
            <View className="w-px bg-gray-200" />
            <View className="flex-1 items-center py-2">
              <Text className="text-2xl font-bold text-gray-700">
                {myHistory?.length ?? 0}
              </Text>
              <Text className="text-xs text-gray-500 mt-1">
                Total Reservations
              </Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Admin Toggle (for demo/testing) */}
      <View className="mt-4">
        <Card>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm font-medium text-gray-800">
                Admin Mode
              </Text>
              <Text className="text-xs text-gray-500">
                Toggle admin privileges for testing
              </Text>
            </View>
            <Pressable
              className={`w-12 h-7 rounded-full justify-center px-0.5 ${isAdmin ? "bg-blue-600" : "bg-gray-300"}`}
              onPress={() => setAdmin(!isAdmin)}
            >
              <View
                className={`w-6 h-6 rounded-full bg-white shadow ${isAdmin ? "self-end" : "self-start"}`}
              />
            </Pressable>
          </View>
        </Card>
      </View>

      {/* Logout */}
      <View className="mt-6">
        <Button
          title="Sign Out"
          variant="danger"
          loading={logoutMutation.isPending}
          onPress={handleLogout}
        />
      </View>
    </View>
  );
}
