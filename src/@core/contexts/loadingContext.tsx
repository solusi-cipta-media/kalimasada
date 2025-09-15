"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface LoadingContextType {
  isPageLoading: boolean;
  setPageLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const usePageLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error("usePageLoading must be used within a LoadingProvider");
  }

  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const [isPageLoading, setIsPageLoading] = useState(false);

  const setPageLoading = (loading: boolean) => {
    setIsPageLoading(loading);
  };

  return <LoadingContext.Provider value={{ isPageLoading, setPageLoading }}>{children}</LoadingContext.Provider>;
};
