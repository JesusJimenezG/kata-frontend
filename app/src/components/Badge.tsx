import { Text, View } from "react-native";

type BadgeVariant = "info" | "success" | "warning" | "danger" | "neutral";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  info: { bg: "bg-blue-100", text: "text-blue-700" },
  success: { bg: "bg-green-100", text: "text-green-700" },
  warning: { bg: "bg-yellow-100", text: "text-yellow-700" },
  danger: { bg: "bg-red-100", text: "text-red-700" },
  neutral: { bg: "bg-gray-100", text: "text-gray-700" },
};

export function Badge({ label, variant = "neutral" }: BadgeProps) {
  const styles = variantStyles[variant];
  return (
    <View className={`${styles.bg} rounded-full px-2.5 py-0.5`}>
      <Text className={`${styles.text} text-xs font-medium`}>{label}</Text>
    </View>
  );
}
