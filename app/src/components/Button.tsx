import { ActivityIndicator, Pressable, Text, type PressableProps } from "react-native";

type Variant = "primary" | "secondary" | "danger" | "outline" | "ghost";

interface ButtonProps extends PressableProps {
  title: string;
  variant?: Variant;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, { container: string; text: string }> = {
  primary: {
    container: "bg-blue-600 active:bg-blue-700",
    text: "text-white font-semibold",
  },
  secondary: {
    container: "bg-gray-200 active:bg-gray-300",
    text: "text-gray-800 font-semibold",
  },
  danger: {
    container: "bg-red-600 active:bg-red-700",
    text: "text-white font-semibold",
  },
  outline: {
    container: "border border-blue-600 bg-transparent active:bg-blue-50",
    text: "text-blue-600 font-semibold",
  },
  ghost: {
    container: "bg-transparent active:bg-gray-100",
    text: "text-blue-600 font-semibold",
  },
};

export function Button({
  title,
  variant = "primary",
  loading = false,
  fullWidth = true,
  disabled,
  ...props
}: ButtonProps) {
  const styles = variantStyles[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      className={`rounded-xl px-6 py-3.5 items-center justify-center ${styles.container} ${fullWidth ? "w-full" : ""} ${isDisabled ? "opacity-50" : ""}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "outline" || variant === "ghost" ? "#2563EB" : "#FFFFFF"}
        />
      ) : (
        <Text className={`text-base ${styles.text}`}>{title}</Text>
      )}
    </Pressable>
  );
}
