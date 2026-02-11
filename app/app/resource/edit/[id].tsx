import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Picker } from "@react-native-picker/picker";

import { Button, Input, LoadingSpinner } from "../../../src/components";
import {
  useResource,
  useUpdateResource,
} from "../../../src/services/api/resources";
import { useResourceTypes } from "../../../src/services/api/resourceTypes";
import { validateRequired, getErrorMessage } from "../../../src/utils";

interface FormErrors {
  name?: string;
  resourceTypeId?: string;
}

export default function EditResourceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: resource, isLoading } = useResource(id);
  const { data: resourceTypes } = useResourceTypes();
  const updateMutation = useUpdateResource();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [resourceTypeId, setResourceTypeId] = useState<number>(0);
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (resource) {
      setName(resource.name);
      setDescription(resource.description ?? "");
      setResourceTypeId(resource.resourceType.id);
      setLocation(resource.location ?? "");
    }
  }, [resource]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {
      name: validateRequired(name, "Name"),
      resourceTypeId:
        resourceTypeId === 0 ? "Resource type is required" : undefined,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleUpdate = () => {
    if (!validate()) return;

    updateMutation.mutate(
      {
        id,
        data: {
          name: name.trim(),
          description: description.trim() || undefined,
          resourceTypeId,
          location: location.trim() || undefined,
        },
      },
      {
        onSuccess: () => router.back(),
        onError: (err) => Alert.alert("Error", getErrorMessage(err)),
      },
    );
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerClassName="p-6 web:max-w-lg web:mx-auto web:w-full web:py-8"
        keyboardShouldPersistTaps="handled"
      >
        <Input
          label="Name *"
          value={name}
          onChangeText={setName}
          error={errors.name}
          placeholder="e.g., Room A-101"
        />

        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Brief description"
          multiline
          numberOfLines={3}
        />

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-1 web:text-base">
            Resource Type *
          </Text>
          <View className="border border-gray-300 rounded-xl overflow-hidden bg-white">
            <Picker
              selectedValue={resourceTypeId}
              onValueChange={(value) => setResourceTypeId(value)}
            >
              <Picker.Item label="Select a type..." value={0} />
              {resourceTypes?.map((type) => (
                <Picker.Item key={type.id} label={type.name} value={type.id} />
              ))}
            </Picker>
          </View>
          {errors.resourceTypeId ? (
            <Text className="text-red-500 text-xs mt-1">
              {errors.resourceTypeId}
            </Text>
          ) : null}
        </View>

        <Input
          label="Location"
          value={location}
          onChangeText={setLocation}
          placeholder="e.g., Building A, Floor 1"
        />

        <View className="mt-4">
          <Button
            title="Save Changes"
            loading={updateMutation.isPending}
            onPress={handleUpdate}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
