"use client";

// React Imports
import { forwardRef } from "react";

// Next Imports
import type { LinkProps } from "next/link";

// Component Imports
import Link from "@components/Link";

// Type Imports
import type { ChildrenType } from "../types";

type RouterLinkProps = LinkProps &
  Partial<ChildrenType> & {
    className?: string;
  };

export const RouterLink = forwardRef((props: RouterLinkProps, ref: any) => {
  // Props
  const { href, className, ...other } = props;

  // Convert href to string if it's an object
  const hrefString = typeof href === "string" ? href : href?.toString() || "/";

  return (
    <Link ref={ref} href={hrefString} className={className} {...other}>
      {props.children}
    </Link>
  );
});
