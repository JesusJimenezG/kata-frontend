import { Text, TextInput, View, type TextInputProps } from "react-native";
import { useState } from "react";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error
    ? "border-red-500"
    : isFocused
      ? "border-blue-500"
      : "border-gray-300";

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-1 web:text-base">
        {label}
      </Text>
      <TextInput
        className={`border rounded-xl px-4 py-3 text-base text-gray-900 bg-white web:py-3.5 web:text-lg web:transition-colors web:duration-200 web:outline-none web:hover:border-gray-400 ${borderColor}`}
        placeholderTextColor="#9CA3AF"
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
      {error ? (
        <Text className="text-red-500 text-xs mt-1">{error}</Text>
      ) : null}
    </View>
  );
}
