import { Pressable, Text, View } from "react-native";

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <Text className="text-6xl mb-4 web:text-7xl">📭</Text>
      <Text className="text-lg font-semibold text-gray-800 text-center mb-2 web:text-xl">
        {title}
      </Text>
      <Text className="text-sm text-gray-500 text-center mb-6 web:text-base">
        {message}
      </Text>
      {actionLabel && onAction ? (
        <Pressable
          className="bg-blue-600 rounded-xl px-6 py-3 active:bg-blue-700"
          onPress={onAction}
        >
          <Text className="text-white font-semibold">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
