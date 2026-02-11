import { Pressable, Text, View, type PressableProps } from "react-native";

interface CardProps extends PressableProps {
  children: React.ReactNode;
}

export function Card({ children, ...props }: CardProps) {
  const isClickable = !!props.onPress;

  return (
    <Pressable
      className={`bg-white rounded-2xl border border-gray-100 p-4 shadow-sm web:shadow-md web:p-5 web:transition-all web:duration-200 ${isClickable ? "active:bg-gray-50 web:cursor-pointer web:hover:shadow-lg web:hover:border-gray-200 web:hover:-translate-y-0.5" : ""}`}
      disabled={!isClickable}
      {...props}
    >
      {children}
    </Pressable>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export function CardHeader({ title, subtitle, right }: CardHeaderProps) {
  return (
    <View className="flex-row items-start justify-between mb-2">
      <View className="flex-1 mr-2">
        <Text className="text-base font-semibold text-gray-900 web:text-lg">
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-sm text-gray-500 mt-0.5">{subtitle}</Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}
