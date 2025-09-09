"use client";

// React Imports
import { useState } from "react";
import type { MouseEvent, ReactNode } from "react";

// MUI Imports
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";

const DropdownButton = ({
  text,
  children,
  variant = "outlined",
  color = "primary"
}: {
  text: string;
  variant?: "outlined" | "contained" | "text";
  color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
  children: ReactNode;
}) => {
  // States
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant={variant}
        color={color}
        aria-controls='basic-menu'
        aria-haspopup='true'
        onClick={handleClick}
        endIcon={<i className='tabler-chevron-down'></i>}
      >
        {text}
      </Button>
      <Menu keepMounted id='basic-menu' anchorEl={anchorEl} onClose={handleClose} open={Boolean(anchorEl)}>
        <label htmlFor='closemenu' onClick={handleClose}>
          {children}
        </label>
      </Menu>
    </>
  );
};

export default DropdownButton;
