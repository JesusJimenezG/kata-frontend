import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  Divider,
  ErrorMessage,
  LoadingSpinner,
  SectionHeader,
} from "../../src/components";
import { useAuthContext } from "../../src/contexts";
import {
  useResource,
  useDeleteResource,
} from "../../src/services/api/resources";
import {
  useResourceReservationHistory,
  useResourceAvailability,
} from "../../src/services/api/reservations";
import {
  formatDate,
  formatDateRange,
  formatResourceType,
  startOfDay,
  endOfDay,
  addDays,
  getErrorMessage,
} from "../../src/utils";
import type { AvailabilitySlot } from "../../src/services/api/types";

export default function ResourceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAdmin } = useAuthContext();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const {
    data: resource,
    isLoading,
    isError,
    error,
    refetch,
  } = useResource(id);
  const deleteMutation = useDeleteResource();

  // Availability for today + next 7 days
  const today = new Date();
  const weekEnd = addDays(today, 7);
  const {
    data: availability,
    isError: availabilityError,
    error: availabilityErrorData,
    refetch: refetchAvailability,
  } = useResourceAvailability(id, startOfDay(today), endOfDay(weekEnd));

  const {
    data: history,
    isError: historyError,
    error: historyErrorData,
    refetch: refetchHistory,
  } = useResourceReservationHistory(id);

  const handleDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        setDeleteError(null);
        router.back();
      },
      onError: (err) => {
        setShowDeleteDialog(false);
        setDeleteError(getErrorMessage(err));
      },
    });
  };

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <View className="flex-1 bg-gray-50">
        <ErrorMessage message={getErrorMessage(error)} onRetry={refetch} />
      </View>
    );
  }

  if (!resource) return null;

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerClassName="web:max-w-5xl web:mx-auto web:w-full"
    >
      {/* Header Card */}
      <View className="bg-white p-6 border-b border-gray-100 web:p-8 md:px-8 lg:px-12 lg:py-10">
        <View className="flex-row items-start justify-between mb-2">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900 web:text-3xl">
              {resource.name}
            </Text>
            {resource.location ? (
              <Text className="text-sm text-gray-500 mt-1 web:text-base web:mt-2">
                📍 {resource.location}
              </Text>
            ) : null}
          </View>
          <Badge
            label={formatResourceType(resource.resourceType.name)}
            variant="info"
          />
        </View>
        {resource.description ? (
          <Text className="text-base text-gray-600 mt-3 web:text-lg web:leading-relaxed">
            {resource.description}
          </Text>
        ) : null}

        <View className="flex-row items-center gap-3 mt-4">
          <Badge
            label={resource.active ? "Active" : "Inactive"}
            variant={resource.active ? "success" : "danger"}
          />
          <Text className="text-xs text-gray-400">
            Created {formatDate(resource.createdAt)}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View className="px-4 pt-4 gap-3 web:pt-6 web:gap-4 md:px-6 lg:px-8">
        {deleteError ? (
          <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 web:px-6 web:py-4">
            <Text className="text-red-700 text-sm web:text-base">
              {deleteError}
            </Text>
          </View>
        ) : null}
        <Button
          title="Reserve this Resource"
          onPress={() =>
            router.push({
              pathname: "/reservation/new",
              params: { resourceId: id, resourceName: resource.name },
            })
          }
        />

        {isAdmin ? (
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Button
                title="Edit"
                variant="outline"
                onPress={() => router.push(`/resource/edit/${id}`)}
              />
            </View>
            <View className="flex-1">
              <Button
                title="Delete"
                variant="danger"
                onPress={() => {
                  setDeleteError(null);
                  setShowDeleteDialog(true);
                }}
              />
            </View>
          </View>
        ) : null}
      </View>

      {/* Availability */}
      {availabilityError ? (
        <ErrorMessage
          message={getErrorMessage(availabilityErrorData)}
          onRetry={refetchAvailability}
        />
      ) : availability && availability.length > 0 ? (
        <View className="mt-4">
          <SectionHeader title="Availability (Next 7 days)" />
          <View className="px-4 gap-2 md:px-6 lg:px-8">
            {availability.map((slot: AvailabilitySlot, index: number) => (
              <View
                key={`${slot.start}-${index}`}
                className={`flex-row items-center justify-between rounded-xl px-4 py-3 web:py-4 web:transition-colors web:duration-200 ${slot.available ? "bg-green-50 border border-green-200 web:hover:bg-green-100" : "bg-red-50 border border-red-200 web:hover:bg-red-100"}`}
              >
                <Text
                  className={`text-sm font-medium web:text-base ${slot.available ? "text-green-700" : "text-red-700"}`}
                >
                  {formatDateRange(slot.start, slot.end)}
                </Text>
                <Badge
                  label={slot.available ? "Available" : "Reserved"}
                  variant={slot.available ? "success" : "danger"}
                />
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* Reservation History */}
      {historyError ? (
        <ErrorMessage
          message={getErrorMessage(historyErrorData)}
          onRetry={refetchHistory}
        />
      ) : history && history.length > 0 ? (
        <View className="mt-4 mb-8 web:mb-12 lg:mt-6">
          <SectionHeader title="Reservation History" />
          <View className="px-4 gap-2 web:gap-3 md:px-6 lg:px-8">
            {history.map((r) => (
              <Card key={r.id}>
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-800 web:text-base">
                      {r.userEmail}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-0.5 web:text-sm">
                      {formatDateRange(r.startTime, r.endTime)}
                    </Text>
                  </View>
                  <Badge
                    label={r.status}
                    variant={r.status === "ACTIVE" ? "success" : "neutral"}
                  />
                </View>
              </Card>
            ))}
          </View>
        </View>
      ) : null}

      <ConfirmDialog
        visible={showDeleteDialog}
        title="Delete Resource"
        message={`Are you sure you want to deactivate "${resource.name}"? This will cancel all future reservations.`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </ScrollView>
  );
}
