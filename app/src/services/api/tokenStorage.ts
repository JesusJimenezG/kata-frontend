import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_EMAIL: "user_email",
} as const;

export interface StoredAuth {
  accessToken: string;
  refreshToken: string;
  email: string;
}

export const tokenStorage = {
  async save(auth: StoredAuth): Promise<void> {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.ACCESS_TOKEN, auth.accessToken],
      [STORAGE_KEYS.REFRESH_TOKEN, auth.refreshToken],
      [STORAGE_KEYS.USER_EMAIL, auth.email],
    ]);
  },

  async getAccessToken(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  async getRefreshToken(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  async getStoredAuth(): Promise<StoredAuth | null> {
    const values = await AsyncStorage.multiGet([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_EMAIL,
    ]);

    const accessToken = values[0][1];
    const refreshToken = values[1][1];
    const email = values[2][1];

    if (!accessToken || !refreshToken || !email) return null;

    return { accessToken, refreshToken, email };
  },

  async clear(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_EMAIL,
    ]);
  },
};
