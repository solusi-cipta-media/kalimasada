"use client";

// React Imports
import type { ComponentProps, MouseEvent } from "react";

import { useRouter } from "next/navigation";

// Next Imports
import NextLink from "next/link";

import { usePageLoading } from "@/@core/contexts/loadingContext";

type Props = Omit<ComponentProps<typeof NextLink>, "href" | "onClick"> & {
  href?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

const Link = (props: Props) => {
  // Props
  const { href, onClick, ...rest } = props;

  // Hooks
  const router = useRouter();
  const { setPageLoading } = usePageLoading();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);

      return;
    }

    if (!href || href === "#") {
      e.preventDefault();

      return;
    }

    // Check if it's an external link or different origin
    if (href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel")) {
      return;
    }

    // Check if it's the same page
    if (href === window.location.pathname + window.location.search) {
      e.preventDefault();

      return;
    }

    // Show loading for internal navigation
    setPageLoading(true);

    // Use router.push for programmatic navigation with loading
    e.preventDefault();
    router.push(href);

    // Hide loading after a short delay to ensure smooth transition
    setTimeout(() => {
      setPageLoading(false);
    }, 500);
  };

  return <NextLink {...rest} href={href || "/"} onClick={handleClick} />;
};

export default Link;
