"use client";

import { usePageLoadingOnRouteChange } from "@/@core/hooks/usePageLoadingOnRouteChange";

interface PageLoaderWrapperProps {
  children: React.ReactNode;
}

const PageLoaderWrapper = ({ children }: PageLoaderWrapperProps) => {
  usePageLoadingOnRouteChange();

  return <>{children}</>;
};

export default PageLoaderWrapper;
