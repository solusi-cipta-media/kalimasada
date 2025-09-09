"use client";
import { useState } from "react";

import { Snackbar, Alert } from "@mui/material";

export interface useSnackBarProps {
  message: string;
  severity: "error" | "warning" | "info" | "success";
  autoHideDuration?: number;
}

export default function useSnackBar(props: useSnackBarProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(props.message);

  const handleClose = () => {
    setOpen(false);
  };

  return {
    SnackBar: (
      <Snackbar
        open={open}
        autoHideDuration={props.autoHideDuration ?? 6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={props.severity ?? "success"} variant='filled' sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    ),
    openSnackBar: () => setOpen(true),
    setMessage
  };
}
