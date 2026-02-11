/// <reference types="nativewind/types" />

declare module "*.css";

declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_API_URL: string;
  }
}

declare var process: {
  env: NodeJS.ProcessEnv;
};
