"use client";

// Third-party Imports
import classnames from "classnames";

// MUI Imports
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// Component Imports
import NavToggle from "./NavToggle";
import Logo from "@components/layout/shared/Logo";
import ModeDropdown from "@components/layout/shared/ModeDropdown";
import UserDropdown from "@components/layout/shared/UserDropdown";

// Hook Imports
import useHorizontalNav from "@menu/hooks/useHorizontalNav";
import { useProfile } from "@core/hooks/useProfile";

// Util Imports
import { horizontalLayoutClasses } from "@layouts/utils/layoutClasses";

const NavbarContent = () => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav();
  const { data: profile } = useProfile();

  return (
    <div
      className={classnames(horizontalLayoutClasses.navbarContent, "flex items-center justify-between gap-4 is-full")}
    >
      <div className='flex items-center gap-4'>
        <NavToggle />
        {/* Hide Logo on Smaller screens */}
        {!isBreakpointReached && <Logo />}
      </div>
      <div className='flex items-center gap-3'>
        <ModeDropdown />
        {profile && (
          <Box className='hidden sm:flex items-center'>
            <Typography variant='body2' className='font-medium text-textPrimary'>
              {profile.fullName}
            </Typography>
          </Box>
        )}
        <UserDropdown />
      </div>
    </div>
  );
};

export default NavbarContent;
