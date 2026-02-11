import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

interface TimePickerProps {
  label: string;
  value: string; // HH:MM
  onTimeSelected: (time: string) => void;
  error?: string;
  minuteInterval?: 15 | 30 | 60;
}

const pad = (n: number) => n.toString().padStart(2, "0");

function generateTimeSlots(interval: number): string[] {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += interval) {
      slots.push(`${pad(h)}:${pad(m)}`);
    }
  }
  return slots;
}

function formatDisplay(time: string): string {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${pad(m)} ${period}`;
}

export function TimePicker({
  label,
  value,
  onTimeSelected,
  error,
  minuteInterval = 30,
}: TimePickerProps) {
  const [visible, setVisible] = useState(false);
  const slots = generateTimeSlots(minuteInterval);

  const borderColor = error
    ? "border-red-500"
    : visible
      ? "border-blue-500"
      : "border-gray-300";

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-1 web:text-base">
        {label}
      </Text>
      <Pressable
        onPress={() => setVisible(true)}
        className={`border rounded-xl px-4 py-3 bg-white flex-row items-center justify-between web:py-3.5 web:cursor-pointer web:transition-colors web:duration-200 web:hover:border-gray-400 ${borderColor}`}
      >
        <Text
          className={`text-base ${value ? "text-gray-900" : "text-gray-400"} web:text-lg`}
        >
          {value ? formatDisplay(value) : "Select time"}
        </Text>
        <Text className="text-gray-400 text-lg">🕐</Text>
      </Pressable>
      {error ? (
        <Text className="text-red-500 text-xs mt-1">{error}</Text>
      ) : null}

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/40 justify-center items-center px-6 web:backdrop-blur-sm"
          onPress={() => setVisible(false)}
        >
          <Pressable
            className="bg-white rounded-2xl w-full max-w-sm overflow-hidden max-h-[70%] web:shadow-2xl"
            onPress={() => {}}
          >
            <View className="px-4 pt-4 pb-2 flex-row items-center justify-between border-b border-gray-100">
              <Text className="text-lg font-semibold text-gray-900">
                {label}
              </Text>
              <Pressable onPress={() => setVisible(false)}>
                <Text className="text-blue-500 font-medium text-base">
                  Close
                </Text>
              </Pressable>
            </View>
            <ScrollView className="px-2 py-2">
              {slots.map((slot) => {
                const isSelected = slot === value;
                return (
                  <Pressable
                    key={slot}
                    onPress={() => {
                      onTimeSelected(slot);
                      setVisible(false);
                    }}
                    className={`px-4 py-3 rounded-xl mb-1 web:cursor-pointer web:transition-colors web:duration-150 ${isSelected ? "bg-blue-500" : "active:bg-gray-100 web:hover:bg-gray-50"}`}
                  >
                    <Text
                      className={`text-base text-center ${isSelected ? "text-white font-semibold" : "text-gray-800"}`}
                    >
                      {formatDisplay(slot)}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
