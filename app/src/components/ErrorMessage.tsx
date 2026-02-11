import { Pressable, Text, View } from "react-native";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mx-4 my-2 web:px-6 web:py-4">
      <Text className="text-red-700 text-sm">{message}</Text>
      {onRetry ? (
        <Pressable onPress={onRetry} className="mt-2 active:opacity-70">
          <Text className="text-red-600 font-semibold text-sm">Retry</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
