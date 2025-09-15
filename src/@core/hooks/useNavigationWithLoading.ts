"use client";

import { useRouter } from "next/navigation";

import { usePageLoading } from "@/@core/contexts/loadingContext";

export const useNavigationWithLoading = () => {
  const router = useRouter();
  const { setPageLoading } = usePageLoading();

  const navigateTo = (href: string) => {
    setPageLoading(true);
    router.push(href);

    // Hide loading after a short delay to ensure smooth transition
    setTimeout(() => {
      setPageLoading(false);
    }, 500);
  };

  return { navigateTo };
};
