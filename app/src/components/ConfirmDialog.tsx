import { Modal, Pressable, Text, View } from "react-native";

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 items-center justify-center bg-black/40 px-6 web:backdrop-blur-sm">
        <View className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-lg web:max-w-md web:p-8 web:shadow-2xl">
          <Text className="text-lg font-bold text-gray-900 mb-2 web:text-xl">
            {title}
          </Text>
          <Text className="text-sm text-gray-600 mb-6 web:text-base web:leading-relaxed">
            {message}
          </Text>
          <View className="flex-row gap-3">
            <Pressable
              className="flex-1 border border-gray-300 rounded-xl py-3 items-center active:bg-gray-100 web:cursor-pointer web:hover:bg-gray-100 web:transition-colors web:duration-200"
              onPress={onCancel}
            >
              <Text className="text-gray-700 font-semibold">{cancelLabel}</Text>
            </Pressable>
            <Pressable
              className={`flex-1 rounded-xl py-3 items-center web:cursor-pointer web:transition-colors web:duration-200 ${destructive ? "bg-red-600 active:bg-red-700 web:hover:bg-red-700" : "bg-blue-600 active:bg-blue-700 web:hover:bg-blue-700"}`}
              onPress={onConfirm}
            >
              <Text className="text-white font-semibold">{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
