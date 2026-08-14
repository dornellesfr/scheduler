import { create } from "axios";

export const api = create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:8000/api",
  timeout: 10000,
});
