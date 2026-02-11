import { Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-blue-600">
        Expo Router Initialized
      </Text>
      <Text className="text-gray-500 mt-2">
        Ready for building the Resource Management app
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
