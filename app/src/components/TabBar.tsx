import { useRef, useState } from "react";
import {
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const contentWidthRef = useRef(0);
  const containerWidthRef = useRef(0);

  function updateIndicators(scrollX = 0) {
    setCanScrollLeft(scrollX > 2);
    setCanScrollRight(
      contentWidthRef.current - scrollX - containerWidthRef.current > 2,
    );
  }

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    updateIndicators(e.nativeEvent.contentOffset.x);
  }

  function handleContentSizeChange(w: number) {
    contentWidthRef.current = w;
    updateIndicators(0);
  }

  function handleLayout(e: LayoutChangeEvent) {
    containerWidthRef.current = e.nativeEvent.layout.width;
    updateIndicators(0);
  }

  return (
    <View className="border-b border-gray-200 web:max-w-5xl web:mx-auto web:w-full">
      <View className="relative">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-4 gap-1 web:gap-2 md:px-6 lg:px-8"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onContentSizeChange={handleContentSizeChange}
          onLayout={handleLayout}
        >
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <Pressable
                key={tab.key}
                className={`px-4 py-3 rounded-t-lg web:cursor-pointer web:transition-colors web:duration-200 web:hover:bg-gray-50 ${isActive ? "border-b-2 border-blue-600" : ""}`}
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

        {canScrollLeft ? (
          <View className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        ) : null}
        {canScrollRight ? (
          <View className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        ) : null}
      </View>
    </View>
  );
}
