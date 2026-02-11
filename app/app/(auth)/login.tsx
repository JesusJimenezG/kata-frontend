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
import { useLogin } from "../../src/services/api/auth";
import { validateEmail, validatePassword, getErrorMessage } from "../../src/utils";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { signIn } = useAuthContext();
  const loginMutation = useLogin();

  const validate = (): boolean => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    setErrors({ email: emailError, password: passwordError });
    return !emailError && !passwordError;
  };

  const handleLogin = () => {
    if (!validate()) return;

    loginMutation.mutate(
      { email: email.trim(), password },
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
        contentContainerClassName="flex-grow justify-center px-6 py-12"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-10">
          <Text className="text-3xl font-bold text-gray-900">Welcome back</Text>
          <Text className="text-base text-gray-500 mt-2">
            Sign in to manage your reservations
          </Text>
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
          placeholder="Enter your password"
          secureTextEntry
          autoComplete="password"
          textContentType="password"
        />

        {loginMutation.isError ? (
          <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
            <Text className="text-red-700 text-sm">
              {getErrorMessage(loginMutation.error)}
            </Text>
          </View>
        ) : null}

        <View className="mt-2">
          <Button
            title="Sign In"
            loading={loginMutation.isPending}
            onPress={handleLogin}
          />
        </View>

        <View className="flex-row items-center justify-center mt-6">
          <Text className="text-gray-500">Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <Pressable>
              <Text className="text-blue-600 font-semibold">Sign Up</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
