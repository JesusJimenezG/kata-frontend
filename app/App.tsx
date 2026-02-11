import "./global.css";
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg font-bold text-blue-600">
          Expo + Tailwind + React Query + React Compiler
        </Text>
        <StatusBar style="auto" />
      </View>
    </QueryClientProvider>
  );
}
