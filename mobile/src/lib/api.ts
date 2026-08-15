import { create } from "axios";

const apiUrl: string =
  process.env.EXPO_PUBLIC_API_URL?.trim() || "http://10.0.2.2:8000/api";

export const api = create({
  baseURL: apiUrl,
  timeout: 10000,
});
