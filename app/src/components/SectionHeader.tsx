import { Text, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  right?: React.ReactNode;
}

export function SectionHeader({ title, right }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
      <Text className="text-lg font-bold text-gray-900 web:text-xl">
        {title}
      </Text>
      {right}
    </View>
  );
}
