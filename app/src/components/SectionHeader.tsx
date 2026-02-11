import { Text, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  right?: React.ReactNode;
}

export function SectionHeader({ title, right }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-4 pt-4 pb-2 web:pt-6 web:pb-3 md:px-6 lg:px-8">
      <Text className="text-lg font-bold text-gray-900 web:text-xl">
        {title}
      </Text>
      {right}
    </View>
  );
}
