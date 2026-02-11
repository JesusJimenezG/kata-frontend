import { Pressable, ScrollView, Text, View } from "react-native";

interface TabItem {
  key: string;
  label: string;
}

interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <View className="border-b border-gray-200">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4 gap-1"
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <Pressable
              key={tab.key}
              className={`px-4 py-3 rounded-t-lg ${isActive ? "border-b-2 border-blue-600" : ""}`}
              onPress={() => onTabChange(tab.key)}
            >
              <Text
                className={`text-sm font-medium ${isActive ? "text-blue-600" : "text-gray-500"}`}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
