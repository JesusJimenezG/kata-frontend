import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Button, Input } from "../../src/components";
import { useAuthContext } from "../../src/contexts";
import { useRegister } from "../../src/services/api/auth";
import {
  validateEmail,
  validatePassword,
  validateRequired,
  getErrorMessage,
} from "../../src/utils";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const { signIn } = useAuthContext();
  const registerMutation = useRegister();

  const validate = (): boolean => {
    const newErrors: FormErrors = {
      firstName: validateRequired(firstName, "First name"),
      lastName: validateRequired(lastName, "Last name"),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword:
        password !== confirmPassword ? "Passwords don't match" : undefined,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleRegister = () => {
    if (!validate()) return;

    registerMutation.mutate(
      {
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      },
      {
        onSuccess: (data) => {
          signIn(data);
          router.replace("/(tabs)");
        },
      },
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-12 web:max-w-md web:mx-auto web:w-full web:px-8 web:py-16"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-10">
          <Text className="text-3xl font-bold text-gray-900 web:text-4xl">
            Create account
          </Text>
          <Text className="text-base text-gray-500 mt-2 web:text-lg">
            Join the resource management platform
          </Text>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Input
              label="First name"
              value={firstName}
              onChangeText={setFirstName}
              error={errors.firstName}
              placeholder="John"
              autoCapitalize="words"
              textContentType="givenName"
            />
          </View>
          <View className="flex-1">
            <Input
              label="Last name"
              value={lastName}
              onChangeText={setLastName}
              error={errors.lastName}
              placeholder="Doe"
              autoCapitalize="words"
              textContentType="familyName"
            />
          </View>
        </View>

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          placeholder="Min. 6 characters"
          secureTextEntry
          autoComplete="new-password"
          textContentType="newPassword"
        />

        <Input
          label="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={errors.confirmPassword}
          placeholder="Re-enter password"
          secureTextEntry
          textContentType="newPassword"
        />

        {registerMutation.isError ? (
          <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
            <Text className="text-red-700 text-sm">
              {getErrorMessage(registerMutation.error)}
            </Text>
          </View>
        ) : null}

        <View className="mt-2">
          <Button
            title="Create Account"
            loading={registerMutation.isPending}
            onPress={handleRegister}
          />
        </View>

        <View className="flex-row items-center justify-center mt-6">
          <Text className="text-gray-500">Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text className="text-blue-600 font-semibold">Sign In</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
