import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Picker } from "@react-native-picker/picker";

import {
  Badge,
  Button,
  Input,
  LoadingSpinner,
  SectionHeader,
} from "../../src/components";
import { useResources } from "../../src/services/api/resources";
import {
  useCreateReservation,
  useResourceAvailability,
} from "../../src/services/api/reservations";
import {
  validateDateRange,
  getErrorMessage,
  toApiDateTime,
  startOfDay,
  endOfDay,
  formatDateRange,
} from "../../src/utils";
import type { AvailabilitySlot } from "../../src/services/api/types";

export default function NewReservationScreen() {
  const params = useLocalSearchParams<{
    resourceId?: string;
    resourceName?: string;
  }>();

  const [resourceId, setResourceId] = useState(params.resourceId ?? "");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{
    resourceId?: string;
    dateRange?: string;
  }>({});

  const { data: resources, isLoading: loadingResources } = useResources({
    active: true,
  });
  const createMutation = useCreateReservation();

  // Build ISO strings from date + time inputs
  const buildIso = (date: string, time: string): string => {
    if (!date || !time) return "";
    return `${date}T${time}:00`;
  };

  const startIso = buildIso(startDate, startTime);
  const endIso = buildIso(endDate, endTime);

  // Availability preview for selected resource and date
  const showAvailability = !!resourceId && !!startDate;
  const availStart = startDate ? startOfDay(new Date(startDate)) : "";
  const availEnd = endDate
    ? endOfDay(new Date(endDate))
    : startDate
      ? endOfDay(new Date(startDate))
      : "";

  const { data: availability } = useResourceAvailability(
    resourceId,
    availStart,
    availEnd,
  );

  const validate = (): boolean => {
    const newErrors: {
      resourceId?: string;
      dateRange?: string;
    } = {};

    if (!resourceId) newErrors.resourceId = "Select a resource";
    if (startIso && endIso) {
      newErrors.dateRange = validateDateRange(startIso, endIso);
    } else {
      newErrors.dateRange = "Start and end date/time are required";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleCreate = () => {
    if (!validate()) return;

    createMutation.mutate(
      {
        resourceId,
        startTime: startIso,
        endTime: endIso,
        notes: notes.trim() || undefined,
      },
      {
        onSuccess: () => router.back(),
        onError: (err) => Alert.alert("Error", getErrorMessage(err)),
      },
    );
  };

  if (loadingResources) return <LoadingSpinner />;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerClassName="p-6"
        keyboardShouldPersistTaps="handled"
      >
        {/* Resource Picker */}
        {params.resourceId ? (
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Resource
            </Text>
            <View className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
              <Text className="text-base text-gray-900">
                {params.resourceName ?? resourceId}
              </Text>
            </View>
          </View>
        ) : (
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Resource *
            </Text>
            <View className="border border-gray-300 rounded-xl overflow-hidden bg-white">
              <Picker
                selectedValue={resourceId}
                onValueChange={(value) => setResourceId(value)}
              >
                <Picker.Item label="Select a resource..." value="" />
                {resources?.map((r) => (
                  <Picker.Item key={r.id} label={r.name} value={r.id} />
                ))}
              </Picker>
            </View>
            {errors.resourceId ? (
              <Text className="text-red-500 text-xs mt-1">
                {errors.resourceId}
              </Text>
            ) : null}
          </View>
        )}

        {/* Date & Time Inputs */}
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Input
              label="Start Date *"
              value={startDate}
              onChangeText={setStartDate}
              placeholder="YYYY-MM-DD"
              keyboardType="numbers-and-punctuation"
            />
          </View>
          <View className="flex-1">
            <Input
              label="Start Time *"
              value={startTime}
              onChangeText={setStartTime}
              placeholder="HH:MM"
              keyboardType="numbers-and-punctuation"
            />
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Input
              label="End Date *"
              value={endDate}
              onChangeText={setEndDate}
              placeholder="YYYY-MM-DD"
              keyboardType="numbers-and-punctuation"
            />
          </View>
          <View className="flex-1">
            <Input
              label="End Time *"
              value={endTime}
              onChangeText={setEndTime}
              placeholder="HH:MM"
              keyboardType="numbers-and-punctuation"
            />
          </View>
        </View>

        {errors.dateRange ? (
          <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 mb-4">
            <Text className="text-red-700 text-sm">{errors.dateRange}</Text>
          </View>
        ) : null}

        <Input
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Optional notes (e.g., Team standup)"
          multiline
          numberOfLines={3}
        />

        {/* Availability Preview */}
        {showAvailability && availability && availability.length > 0 ? (
          <View className="mb-4">
            <SectionHeader title="Availability" />
            <View className="gap-2">
              {availability.map((slot: AvailabilitySlot, idx: number) => (
                <View
                  key={`${slot.start}-${idx}`}
                  className={`flex-row items-center justify-between rounded-xl px-4 py-2 ${slot.available ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                >
                  <Text
                    className={`text-xs font-medium ${slot.available ? "text-green-700" : "text-red-700"}`}
                  >
                    {formatDateRange(slot.start, slot.end)}
                  </Text>
                  <Badge
                    label={slot.available ? "Free" : "Taken"}
                    variant={slot.available ? "success" : "danger"}
                  />
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View className="mt-2">
          <Button
            title="Create Reservation"
            loading={createMutation.isPending}
            onPress={handleCreate}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
