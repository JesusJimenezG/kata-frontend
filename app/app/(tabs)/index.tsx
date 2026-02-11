import { FlatList, Pressable, Text, View } from "react-native";
import { router } from "expo-router";

import {
  Badge,
  Card,
  CardHeader,
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
} from "../../src/components";
import { useAuthContext } from "../../src/contexts";
import { useResources } from "../../src/services/api/resources";

export default function ResourcesScreen() {
  const { isAdmin } = useAuthContext();
  const {
    data: resources,
    isLoading,
    isError,
    error,
    refetch,
  } = useResources({ active: true });

  if (isLoading) return <LoadingSpinner />;

  return (
    <View className="flex-1 bg-gray-50">
      {isAdmin ? (
        <View className="px-4 pt-4 web:max-w-3xl web:mx-auto web:w-full">
          <Pressable
            className="bg-blue-600 rounded-xl py-3 items-center active:bg-blue-700"
            onPress={() => router.push("/resource/new")}
          >
            <Text className="text-white font-semibold text-base">
              + New Resource
            </Text>
          </Pressable>
        </View>
      ) : null}

      {isError ? (
        <ErrorMessage
          message={error?.message ?? "Failed to load resources"}
          onRetry={refetch}
        />
      ) : null}

      <FlatList
        data={resources}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4 gap-3 web:max-w-3xl web:mx-auto web:w-full web:py-6"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Card onPress={() => router.push(`/resource/${item.id}`)}>
            <CardHeader
              title={item.name}
              subtitle={item.location || undefined}
              right={<Badge label={item.resourceType.name} variant="info" />}
            />
            {item.description ? (
              <Text className="text-sm text-gray-600 mt-1" numberOfLines={2}>
                {item.description}
              </Text>
            ) : null}
          </Card>
        )}
        ListEmptyComponent={
          !isError ? (
            <EmptyState
              title="No resources yet"
              message="Resources will appear here once they are created"
            />
          ) : null
        }
      />
    </View>
  );
}
