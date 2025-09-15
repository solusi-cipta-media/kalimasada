"use client";

// Third-party Imports
import classnames from "classnames";

// MUI Imports
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// Component Imports
import NavToggle from "./NavToggle";
import ModeDropdown from "@components/layout/shared/ModeDropdown";
import UserDropdown from "@components/layout/shared/UserDropdown";

// Hook Imports
import { useProfile } from "@core/hooks/useProfile";

// Util Imports
import { verticalLayoutClasses } from "@layouts/utils/layoutClasses";

const NavbarContent = () => {
  const { data: profile } = useProfile();

  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, "flex items-center justify-between gap-4 is-full")}>
      <div className='flex items-center gap-4'>
        <NavToggle />
        <ModeDropdown />
      </div>
      <div className='flex items-center gap-3'>
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
