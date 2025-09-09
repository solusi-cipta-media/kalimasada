"use client";
import React, { createContext } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const QueryClientContext = createContext<QueryClient | null>(null);
const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 1_000 * 60 } } });

export const TanstackQueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <QueryClientContext.Provider value={queryClient}>{children}</QueryClientContext.Provider>
    </QueryClientProvider>
  );
};
