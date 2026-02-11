import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  SectionList,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";

import {
  Badge,
  Card,
  CardHeader,
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  SectionHeader,
  TabBar,
} from "../../src/components";
import { useAuthContext } from "../../src/contexts";
import { useResources } from "../../src/services/api/resources";
import type { ResourceResponse } from "../../src/services/api/types";
import { formatResourceType, getErrorMessage } from "../../src/utils";

const ALL_TAB_KEY = "__all__";

interface ResourceSection {
  title: string;
  data: ResourceResponse[];
}

function groupByResourceType(resources: ResourceResponse[]): ResourceSection[] {
  const grouped = new Map<string, ResourceResponse[]>();

  for (const resource of resources) {
    const typeName = resource.resourceType.name;
    const group = grouped.get(typeName);
    if (group) {
      group.push(resource);
    } else {
      grouped.set(typeName, [resource]);
    }
  }

  return Array.from(grouped, ([title, data]) => ({
    title: formatResourceType(title),
    data,
  })).sort((a, b) => a.title.localeCompare(b.title));
}

function getTypeTabs(resources: ResourceResponse[]) {
  const typeNames = new Set<string>();
  for (const r of resources) {
    typeNames.add(r.resourceType.name);
  }
  const sorted = Array.from(typeNames).sort((a, b) =>
    formatResourceType(a).localeCompare(formatResourceType(b)),
  );
  return [
    { key: ALL_TAB_KEY, label: "All" },
    ...sorted.map((name) => ({ key: name, label: formatResourceType(name) })),
  ];
}

export default function ResourcesScreen() {
  const { isAdmin } = useAuthContext();
  const [activeType, setActiveType] = useState(ALL_TAB_KEY);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: resources,
    isLoading,
    isFetching,
    isPlaceholderData,
    isError,
    error,
    refetch,
  } = useResources({
    active: true,
    search: debouncedSearch || undefined,
  });

  // Only block the full screen on the very first mount (no data at all)
  if (isLoading && !resources) return <LoadingSpinner />;

  const allResources = resources ?? [];
  const tabs = getTypeTabs(allResources);

  const sections = groupByResourceType(allResources);
  const isFiltered = activeType !== ALL_TAB_KEY;
  const filteredResources = isFiltered
    ? allResources.filter((r) => r.resourceType.name === activeType)
    : allResources;

  const listLoading = isFetching || isPlaceholderData;

  return (
    <View className="flex-1 bg-gray-50">
      {isAdmin ? (
        <View className="px-4 pt-4 web:max-w-5xl web:mx-auto web:w-full web:pt-6 md:px-6 lg:px-8">
          <Pressable
            className="bg-blue-600 rounded-xl py-3 items-center active:bg-blue-700 web:cursor-pointer web:hover:bg-blue-700 web:transition-colors web:duration-200 web:hover:shadow-md md:py-3.5 lg:rounded-2xl"
            onPress={() => router.push("/resource/new")}
          >
            <Text className="text-white font-semibold text-base">
              + New Resource
            </Text>
          </Pressable>
        </View>
      ) : null}

      <View className="px-4 pt-3 web:max-w-5xl web:mx-auto web:w-full web:pt-4 md:px-6 lg:px-8">
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 bg-white web:py-3.5 web:text-lg web:transition-colors web:duration-200 web:outline-none web:hover:border-gray-400 md:rounded-2xl lg:py-4"
          placeholder="Search resources..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      {allResources.length > 0 ? (
        <TabBar
          tabs={tabs}
          activeTab={activeType}
          onTabChange={setActiveType}
        />
      ) : null}

      {isError ? (
        <ErrorMessage message={getErrorMessage(error)} onRetry={refetch} />
      ) : null}

      {listLoading ? (
        <LoadingSpinner />
      ) : isFiltered ? (
        <FlatList
          data={filteredResources}
          keyExtractor={(item) => item.id}
          contentContainerClassName="p-4 gap-3 web:max-w-5xl web:mx-auto web:w-full web:py-6 web:gap-4 md:px-6 lg:px-8 lg:py-8"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Card onPress={() => router.push(`/resource/${item.id}`)}>
              <CardHeader
                title={item.name}
                subtitle={item.location || undefined}
              />
              {item.description ? (
                <Text
                  className="text-sm text-gray-600 mt-1 web:text-base"
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
              ) : null}
            </Card>
          )}
          ListEmptyComponent={
            <EmptyState
              title="No resources"
              message="No resources found for this type"
            />
          }
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerClassName="p-4 web:max-w-5xl web:mx-auto web:w-full web:py-6 web:gap-1 md:px-6 lg:px-8 lg:py-8"
          showsVerticalScrollIndicator={false}
          renderSectionHeader={({ section }) => (
            <SectionHeader
              title={section.title}
              right={<Badge label={`${section.data.length}`} variant="info" />}
            />
          )}
          renderItem={({ item }) => (
            <View className="mb-3 web:mb-4">
              <Card onPress={() => router.push(`/resource/${item.id}`)}>
                <CardHeader
                  title={item.name}
                  subtitle={item.location || undefined}
                />
                {item.description ? (
                  <Text
                    className="text-sm text-gray-600 mt-1 web:text-base"
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>
                ) : null}
              </Card>
            </View>
          )}
          ListEmptyComponent={
            !isError ? (
              <EmptyState
                title="No resources yet"
                message="Resources will appear here once they are created"
              />
            ) : null
          }
          stickySectionHeadersEnabled={false}
        />
      )}
    </View>
  );
}
