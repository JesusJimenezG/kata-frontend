import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Picker } from "@react-native-picker/picker";

import {
  Badge,
  Button,
  CalendarPicker,
  ErrorMessage,
  Input,
  LoadingSpinner,
  SectionHeader,
  TimePicker,
} from "../../src/components";
import { useResources } from "../../src/services/api/resources";
import {
  useCreateReservation,
  useResourceAvailability,
} from "../../src/services/api/reservations";
import {
  validateDateRange,
  getErrorMessage,
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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    resourceId?: string;
    dateRange?: string;
  }>({});

  const {
    data: resources,
    isLoading: loadingResources,
    isError: resourcesError,
    error: resourcesErrorData,
    refetch: refetchResources,
  } = useResources({ active: true });
  const createMutation = useCreateReservation();

  // Build ISO strings from date + time inputs
  const buildIso = (date: string, time: string): string => {
    if (!date || !time) return "";
    return `${date}T${time}:00`;
  };

  const startIso = buildIso(startDate, startTime);
  const endIso = buildIso(endDate || startDate, endTime);
  const isOverlapError = submitError
    ? submitError.toLowerCase().includes("overlap")
    : false;

  // Availability preview for selected resource and date
  const showAvailability = !!resourceId && !!startDate;
  const availStart = startDate ? startOfDay(new Date(startDate)) : "";
  const availEnd = endDate
    ? endOfDay(new Date(endDate))
    : startDate
      ? endOfDay(new Date(startDate))
      : "";

  const {
    data: availability,
    isError: availabilityError,
    error: availabilityErrorData,
    refetch: refetchAvailability,
  } = useResourceAvailability(resourceId, availStart, availEnd);

  useEffect(() => {
    if (submitError) setSubmitError(null);
  }, [resourceId, startDate, startTime, endDate, endTime]);

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
    setSubmitError(null);

    createMutation.mutate(
      {
        resourceId,
        startTime: startIso,
        endTime: endIso,
        notes: notes.trim() || undefined,
      },
      {
        onSuccess: () => router.replace("/(tabs)/reservations"),
        onError: (err) => setSubmitError(getErrorMessage(err)),
      },
    );
  };

  if (loadingResources) return <LoadingSpinner />;
  if (resourcesError) {
    return (
      <View className="flex-1 bg-gray-50">
        <ErrorMessage
          message={getErrorMessage(resourcesErrorData)}
          onRetry={refetchResources}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerClassName="p-6 web:max-w-2xl web:mx-auto web:w-full web:py-8 md:px-8 lg:px-12 lg:py-10"
        keyboardShouldPersistTaps="handled"
      >
        {/* Resource Picker */}
        {params.resourceId ? (
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1 web:text-base">
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
            <Text className="text-sm font-medium text-gray-700 mb-1 web:text-base">
              Resource *
            </Text>
            <View className="border border-gray-300 rounded-xl overflow-hidden bg-white web:cursor-pointer">
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

        {/* Date & Time Pickers */}
        <CalendarPicker
          label="Start Date *"
          value={startDate}
          onDateSelected={setStartDate}
        />

        <View className="flex-row gap-3">
          <View className="flex-1">
            <TimePicker
              label="Start Time *"
              value={startTime}
              onTimeSelected={setStartTime}
            />
          </View>
          <View className="flex-1">
            <TimePicker
              label="End Time *"
              value={endTime}
              onTimeSelected={setEndTime}
            />
          </View>
        </View>

        <CalendarPicker
          label="End Date *"
          value={endDate}
          onDateSelected={setEndDate}
          minDate={startDate || undefined}
        />

        {errors.dateRange ? (
          <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 mb-4 web:px-6 web:py-3">
            <Text className="text-red-700 text-sm web:text-base">
              {errors.dateRange}
            </Text>
          </View>
        ) : null}

        {submitError ? (
          <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 web:px-6 web:py-4">
            <Text className="text-red-700 text-sm font-semibold web:text-base">
              {isOverlapError ? "Time slot conflict" : "Reservation failed"}
            </Text>
            <Text className="text-red-700 text-sm mt-1 web:text-base">
              {submitError}
            </Text>
            {isOverlapError ? (
              <Text className="text-red-600 text-xs mt-2 web:text-sm">
                Pick a different time or review availability below.
              </Text>
            ) : null}
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
        {availabilityError ? (
          <ErrorMessage
            message={getErrorMessage(availabilityErrorData)}
            onRetry={refetchAvailability}
          />
        ) : showAvailability && availability && availability.length > 0 ? (
          <View className="mb-4">
            <SectionHeader title="Availability" />
            <View className="gap-2">
              {availability.map((slot: AvailabilitySlot, idx: number) => (
                <View
                  key={`${slot.start}-${idx}`}
                  className={`flex-row items-center justify-between rounded-xl px-4 py-2 web:py-3 web:transition-colors web:duration-200 ${slot.available ? "bg-green-50 border border-green-200 web:hover:bg-green-100" : "bg-red-50 border border-red-200 web:hover:bg-red-100"}`}
                >
                  <Text
                    className={`text-xs font-medium web:text-sm ${slot.available ? "text-green-700" : "text-red-700"}`}
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
