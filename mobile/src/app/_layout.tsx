import "../global.css";

import { PortalHost } from "@rn-primitives/portal";
import { QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";

import { queryClient } from "../lib/query-client";

export default function Layout(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
      <PortalHost />
    </QueryClientProvider>
  );
}
