"use client";

import { useEffect } from "react";

import { usePathname, useSearchParams } from "next/navigation";

import { usePageLoading } from "@/@core/contexts/loadingContext";

export const usePageLoadingOnRouteChange = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setPageLoading } = usePageLoading();

  useEffect(() => {
    // Hide loading when route changes
    setPageLoading(false);
  }, [pathname, searchParams, setPageLoading]);
};
