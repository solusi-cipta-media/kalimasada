"use client";

// Third-party Imports
import classnames from "classnames";

import { useQuery } from "@tanstack/react-query";

// Hook Imports
import useVerticalNav from "@menu/hooks/useVerticalNav";
import useHorizontalNav from "@menu/hooks/useHorizontalNav";
import { useSettings } from "@core/hooks/useSettings";

// Util Imports
import { verticalLayoutClasses } from "@layouts/utils/layoutClasses";
import getNextConfig from "@/configs/nextConfig";

const FooterContent = () => {
  const { data: version } = useQuery({
    queryKey: ["version"],
    queryFn: async () => {
      const config = await getNextConfig();

      return config.version;
    },
    staleTime: 1000 * 60 * 60 * 24 // 1 day
  });

  // Hooks
  const { settings } = useSettings();
  const { isBreakpointReached: isVerticalBreakpointReached } = useVerticalNav();
  const { isBreakpointReached: isHorizontalBreakpointReached } = useHorizontalNav();

  // Vars
  const isBreakpointReached =
    settings.layout === "vertical" ? isVerticalBreakpointReached : isHorizontalBreakpointReached;

  return (
    <div
      className={classnames(verticalLayoutClasses.footerContent, "flex items-center justify-between flex-wrap gap-4")}
    >
      <p>
        <span>COPYRIGHT © {new Date().getFullYear()} NEXT JS VUEXY KIT</span>
      </p>
      {!isBreakpointReached && <div className='flex items-center gap-4'>v{version}</div>}
    </div>
  );
};

export default FooterContent;
