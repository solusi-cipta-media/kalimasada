"use client";

// React Imports
import { useRef, useState } from "react";
import type { MouseEvent } from "react";

// Next Imports
import { useRouter } from "next/navigation";

// MUI Imports
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuList from "@mui/material/MenuList";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

import { useSettings } from "@core/hooks/useSettings";
import { useProfile } from "@core/hooks/useProfile";
import { requestLogout } from "@/client/auth";
import { COOKIE_NAME } from "@/configs/cookies";
import readFileUpload from "@/@core/utils/readFileUpload";

// Styled component for badge content
const BadgeContentSpan = styled("span")({
  width: 8,
  height: 8,
  borderRadius: "50%",
  cursor: "pointer",
  backgroundColor: "var(--mui-palette-success-main)",
  boxShadow: "0 0 0 2px var(--mui-palette-background-paper)"
});

const UserDropdown = () => {
  // States
  const [open, setOpen] = useState(false);

  // Refs
  const anchorRef = useRef<HTMLDivElement>(null);

  // Hooks
  const router = useRouter();
  const { settings } = useSettings();
  const { data: profile } = useProfile();

  const handleDropdownOpen = () => {
    !open ? setOpen(true) : setOpen(false);
  };

  const handleDropdownClose = (event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), url?: string) => {
    if (url) {
      router.push(url);
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  function deleteCookie(name: string) {
    document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; value=;";
  }

  const handleUserLogout = async () => {
    deleteCookie(COOKIE_NAME);

    await requestLogout();

    // Redirect to login page
    setTimeout(() => {
      location.reload();
    }, 100);
  };

  return (
    <>
      <Badge
        ref={anchorRef}
        overlap='circular'
        badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        className='mis-2'
      >
        <Avatar
          ref={anchorRef}
          alt='Avatar'
          src={profile?.avatar ? `${readFileUpload(profile?.avatar)}` : "/images/avatars/1.png"}
          onClick={handleDropdownOpen}
          className='cursor-pointer bs-[38px] is-[38px]'
        />
      </Badge>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-3 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === "bottom-end" ? "right top" : "left top"
            }}
          >
            <Paper className={settings.skin === "bordered" ? "border shadow-none" : "shadow-lg"}>
              <ClickAwayListener onClickAway={(e) => handleDropdownClose(e as MouseEvent | TouchEvent)}>
                <MenuList>
                  <div className='flex items-center plb-2 pli-6 gap-2' tabIndex={-1}>
                    <Avatar
                      alt='Avatar'
                      src={profile?.avatar ? `${readFileUpload(profile.avatar)}` : "/images/avatars/1.png"}
                    />
                    {profile && (
                      <div className='flex items-start flex-col'>
                        <Typography className='font-medium' color='text.primary'>
                          {profile.fullName ?? "-"}
                        </Typography>
                        <Typography variant='caption'>{profile.email ?? "-"}</Typography>
                      </div>
                    )}
                  </div>
                  <Divider className='mlb-1' />
                  <MenuItem className='mli-2 gap-3' onClick={(e) => handleDropdownClose(e, "/account/profile")}>
                    <i className='tabler-user text-[22px]' />
                    <Typography color='text.primary'>My Profile</Typography>
                  </MenuItem>
                  <MenuItem className='mli-2 gap-3' onClick={(e) => handleDropdownClose(e)}>
                    <i className='tabler-settings text-[22px]' />
                    <Typography color='text.primary'>Settings</Typography>
                  </MenuItem>
                  <MenuItem className='mli-2 gap-3' onClick={(e) => handleDropdownClose(e)}>
                    <i className='tabler-currency-dollar text-[22px]' />
                    <Typography color='text.primary'>Pricing</Typography>
                  </MenuItem>
                  <MenuItem className='mli-2 gap-3' onClick={(e) => handleDropdownClose(e)}>
                    <i className='tabler-help-circle text-[22px]' />
                    <Typography color='text.primary'>FAQ</Typography>
                  </MenuItem>
                  <div className='flex items-center plb-2 pli-3'>
                    <Button
                      fullWidth
                      variant='contained'
                      color='error'
                      size='small'
                      endIcon={<i className='tabler-logout' />}
                      onClick={handleUserLogout}
                      sx={{ "& .MuiButton-endIcon": { marginInlineStart: 1.5 } }}
                    >
                      Logout
                    </Button>
                  </div>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default UserDropdown;
