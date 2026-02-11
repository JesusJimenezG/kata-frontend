import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Calendar, type DateData } from "react-native-calendars";

interface CalendarPickerProps {
  label: string;
  value: string; // YYYY-MM-DD
  onDateSelected: (date: string) => void;
  minDate?: string;
  error?: string;
  markedDates?: Record<
    string,
    {
      selected?: boolean;
      marked?: boolean;
      dotColor?: string;
      selectedColor?: string;
      disabled?: boolean;
    }
  >;
}

export function CalendarPicker({
  label,
  value,
  onDateSelected,
  minDate,
  error,
  markedDates,
}: CalendarPickerProps) {
  const [visible, setVisible] = useState(false);

  const formatDisplay = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDayPress = (day: DateData) => {
    onDateSelected(day.dateString);
    setVisible(false);
  };

  const borderColor = error
    ? "border-red-500"
    : visible
      ? "border-blue-500"
      : "border-gray-300";

  const allMarked = {
    ...markedDates,
    ...(value
      ? {
          [value]: {
            ...markedDates?.[value],
            selected: true,
            selectedColor: "#3B82F6",
          },
        }
      : {}),
  };

  const today = new Date().toISOString().split("T")[0];

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
          {value ? formatDisplay(value) : "Select date"}
        </Text>
        <Text className="text-gray-400 text-lg">📅</Text>
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
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden web:shadow-2xl"
            onPress={() => {}}
          >
            <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-gray-900">
                {label}
              </Text>
              <Pressable onPress={() => setVisible(false)}>
                <Text className="text-blue-500 font-medium text-base">
                  Close
                </Text>
              </Pressable>
            </View>
            <Calendar
              current={value || today}
              minDate={minDate ?? today}
              onDayPress={handleDayPress}
              markedDates={allMarked}
              theme={{
                todayTextColor: "#3B82F6",
                arrowColor: "#3B82F6",
                selectedDayBackgroundColor: "#3B82F6",
                textDayFontSize: 15,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 13,
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
