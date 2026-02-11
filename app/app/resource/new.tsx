import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { Picker } from "@react-native-picker/picker";

import { Button, ErrorMessage, Input } from "../../src/components";
import { useCreateResource } from "../../src/services/api/resources";
import { useResourceTypes } from "../../src/services/api/resourceTypes";
import { validateRequired, getErrorMessage } from "../../src/utils";

interface FormErrors {
  name?: string;
  resourceTypeId?: string;
}

export default function NewResourceScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [resourceTypeId, setResourceTypeId] = useState<number>(0);
  const [location, setLocation] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const {
    data: resourceTypes,
    isError: resourceTypesError,
    error: resourceTypesErrorData,
    refetch: refetchResourceTypes,
  } = useResourceTypes();
  const createMutation = useCreateResource();

  useEffect(() => {
    if (submitError) setSubmitError(null);
  }, [name, description, resourceTypeId, location]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {
      name: validateRequired(name, "Name"),
      resourceTypeId:
        resourceTypeId === 0 ? "Resource type is required" : undefined,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleCreate = () => {
    if (!validate()) return;
    setSubmitError(null);

    createMutation.mutate(
      {
        name: name.trim(),
        description: description.trim() || undefined,
        resourceTypeId,
        location: location.trim() || undefined,
      },
      {
        onSuccess: () => router.back(),
        onError: (err) => setSubmitError(getErrorMessage(err)),
      },
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerClassName="p-6 web:max-w-2xl web:mx-auto web:w-full web:py-8 md:px-8 lg:px-12 lg:py-10"
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

        {resourceTypesError ? (
          <ErrorMessage
            message={getErrorMessage(resourceTypesErrorData)}
            onRetry={refetchResourceTypes}
          />
        ) : null}

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-1 web:text-base">
            Resource Type *
          </Text>
          <View className="border border-gray-300 rounded-xl overflow-hidden bg-white web:cursor-pointer">
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

        {submitError ? (
          <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-4 web:px-6 web:py-4">
            <Text className="text-red-700 text-sm web:text-base">
              {submitError}
            </Text>
          </View>
        ) : null}

        <View className="mt-4">
          <Button
            title="Create Resource"
            loading={createMutation.isPending}
            onPress={handleCreate}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
