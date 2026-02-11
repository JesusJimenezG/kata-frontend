import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

export interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export function Dropdown({
  label,
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  error,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const borderColor = error
    ? "border-red-500"
    : isOpen
      ? "border-blue-500"
      : "border-gray-300";

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-1 web:text-base">
        {label}
      </Text>
      <Pressable
        className={`border rounded-xl px-4 py-3 bg-white flex-row items-center justify-between web:py-3.5 ${borderColor}`}
        onPress={() => setIsOpen(true)}
      >
        <Text
          className={`text-base web:text-lg ${selectedOption ? "text-gray-900" : "text-gray-400"}`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text className="text-gray-400 text-base">▼</Text>
      </Pressable>
      {error ? (
        <Text className="text-red-500 text-xs mt-1">{error}</Text>
      ) : null}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/40 justify-center items-center px-6"
          onPress={() => setIsOpen(false)}
        >
          <View className="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
            <Text className="text-lg font-semibold text-gray-900 px-5 pt-5 pb-3">
              {label}
            </Text>
            <ScrollView className="max-h-72">
              {options.map((option) => (
                <Pressable
                  key={option.value}
                  className={`px-5 py-3.5 border-b border-gray-100 ${
                    option.value === value ? "bg-blue-50" : ""
                  }`}
                  onPress={() => {
                    onValueChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  <Text
                    className={`text-base ${
                      option.value === value
                        ? "text-blue-600 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable
              className="px-5 py-4 border-t border-gray-200"
              onPress={() => setIsOpen(false)}
            >
              <Text className="text-center text-blue-600 font-semibold text-base">
                Cancel
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
