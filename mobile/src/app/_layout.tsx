import "../global.css";

import { Slot } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "../lib/query-client";

export default function Layout(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
    </QueryClientProvider>
  );
}
