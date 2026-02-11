import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

import {
  Badge,
  Card,
  CardHeader,
  ConfirmDialog,
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  TabBar,
  Button,
} from "../../src/components";
import { useAuthContext } from "../../src/contexts";
import {
  useActiveReservations,
  useMyActiveReservations,
  useMyReservationHistory,
  useCancelReservation,
} from "../../src/services/api/reservations";
import { formatDateRange, getErrorMessage } from "../../src/utils";
import type { ReservationResponse } from "../../src/services/api/types";

const TABS = [
  { key: "my", label: "My Active" },
  { key: "all", label: "All Active" },
  { key: "history", label: "History" },
];

export default function ReservationsScreen() {
  const [activeTab, setActiveTab] = useState("my");
  const [cancelTarget, setCancelTarget] = useState<ReservationResponse | null>(
    null,
  );
  const [cancelError, setCancelError] = useState<string | null>(null);

  const { userEmail, isAdmin } = useAuthContext();

  const myActive = useMyActiveReservations();
  const allActive = useActiveReservations();
  const history = useMyReservationHistory();
  const cancelMutation = useCancelReservation();

  const activeQuery =
    activeTab === "my" ? myActive : activeTab === "all" ? allActive : history;

  const data = activeQuery.data;
  const isLoading = activeQuery.isLoading;
  const isError = activeQuery.isError;
  const error = activeQuery.error;

  useEffect(() => {
    if (cancelError) setCancelError(null);
  }, [activeTab]);

  const canCancel = (reservation: ReservationResponse) =>
    reservation.status === "ACTIVE" &&
    (reservation.userEmail === userEmail || isAdmin);

  const handleCancel = () => {
    if (!cancelTarget) return;
    cancelMutation.mutate(cancelTarget.id, {
      onSuccess: () => {
        setCancelTarget(null);
        setCancelError(null);
      },
      onError: (err) => {
        setCancelTarget(null);
        setCancelError(getErrorMessage(err));
      },
    });
  };

  const renderItem = ({ item }: { item: ReservationResponse }) => (
    <Card>
      <CardHeader
        title={item.resourceName}
        subtitle={formatDateRange(item.startTime, item.endTime)}
        right={
          <Badge
            label={item.status}
            variant={item.status === "ACTIVE" ? "success" : "neutral"}
          />
        }
      />
      {item.notes ? (
        <Text className="text-sm text-gray-500 mt-1">{item.notes}</Text>
      ) : null}
      <View className="flex-row items-center justify-between mt-3">
        <Text className="text-xs text-gray-400">{item.userEmail}</Text>
        {canCancel(item) ? (
          <Button
            title="Cancel"
            variant="danger"
            fullWidth={false}
            onPress={() => setCancelTarget(item)}
          />
        ) : null}
      </View>
    </Card>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {cancelError ? <ErrorMessage message={cancelError} /> : null}

      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <ErrorMessage
          message={getErrorMessage(error)}
          onRetry={() => activeQuery.refetch()}
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerClassName="p-4 gap-3 web:max-w-3xl web:mx-auto web:w-full web:py-6"
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          ListEmptyComponent={
            <EmptyState
              title="No reservations"
              message={
                activeTab === "my"
                  ? "You haven't made any reservations yet"
                  : activeTab === "all"
                    ? "No active reservations at the moment"
                    : "No reservation history to show"
              }
            />
          }
        />
      )}

      <ConfirmDialog
        visible={!!cancelTarget}
        title="Cancel Reservation"
        message={`Cancel reservation for "${cancelTarget?.resourceName}"?`}
        confirmLabel="Cancel Reservation"
        destructive
        onConfirm={handleCancel}
        onCancel={() => setCancelTarget(null)}
      />
    </View>
  );
}
