"use client";

// React Imports
import { useEffect, useRef } from "react";

// Next Imports
// import Img from 'next/image'
import Link from "next/link";
import Image from "next/image";

// Third-party Imports
import styled from "@emotion/styled";

import { Grid, Typography } from "@mui/material";

// Type Imports
import type { VerticalNavContextProps } from "@menu/contexts/verticalNavContext";

// Config Imports
import themeConfig from "@configs/themeConfig";

// Hook Imports
import useVerticalNav from "@menu/hooks/useVerticalNav";

import { useSettings } from "@core/hooks/useSettings";

type LogoTextProps = {
  isHovered?: VerticalNavContextProps["isHovered"];
  isCollapsed?: VerticalNavContextProps["isCollapsed"];
  transitionDuration?: VerticalNavContextProps["transitionDuration"];
};

const LogoText = styled.span<LogoTextProps>`
  font-size: 1.375rem;
  line-height: 1.09091;
  font-weight: 700;
  letter-spacing: 0.25px;
  color: var(--mui-palette-text-primary);
  transition: ${({ transitionDuration }) =>
    `margin-inline-start ${transitionDuration}ms ease-in-out, opacity ${transitionDuration}ms ease-in-out`};

  ${({ isHovered, isCollapsed }) =>
    isCollapsed && !isHovered ? "opacity: 0; margin-inline-start: 0;" : "opacity: 1; margin-inline-start: 0;"}
`;

const Logo = () => {
  // Refs
  const logoTextRef = useRef<HTMLSpanElement>(null);

  // Hooks
  const { isHovered, transitionDuration } = useVerticalNav();
  const { settings } = useSettings();

  // Vars
  const { layout } = settings;

  useEffect(() => {
    if (layout !== "collapsed") {
      return;
    }

    if (logoTextRef && logoTextRef.current) {
      if (layout === "collapsed" && !isHovered) {
        logoTextRef.current?.classList.add("hidden");
      } else {
        logoTextRef.current.classList.remove("hidden");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, layout]);

  // You may return any JSX here to display a logo in the sidebar header
  // return <Img src='/next.svg' width={100} height={25} alt='logo' /> // for example
  return (
    <Link href='/' className='flex items-center'>
      <LogoText
        ref={logoTextRef}
        isHovered={isHovered}
        isCollapsed={layout === "collapsed"}
        transitionDuration={transitionDuration}
      >
        <Grid container gap={1} direction={"row"} className='justify-center md:justify-start' alignContent={"center"}>
          {themeConfig.icon && (
            <Grid item className='w-[40px]'>
              <Image src={themeConfig.icon} width={40} height={40} alt='logo' />
            </Grid>
          )}
          <Grid item xs container alignContent={"center"} direction={"column"}>
            <Typography fontSize={16} fontWeight={700}>
              {themeConfig.templateName}
            </Typography>
            <Typography fontSize={10} fontWeight={500}>
              {themeConfig.subTemplateName}
            </Typography>
          </Grid>
        </Grid>
      </LogoText>
    </Link>
  );
};

export default Logo;
