"use client";

import { styled, Typography } from "@mui/material";
import type { PickerValidDate, TimePickerProps } from "@mui/x-date-pickers";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

const StyledTimePicker = styled(MobileTimePicker)<TimePickerProps<PickerValidDate, boolean>>(({ theme }) => ({
  "& .MuiInputLabel-root": {
    transform: "none",
    width: "fit-content",
    maxWidth: "100%",
    lineHeight: 1.153,
    position: "relative",
    fontSize: theme.typography.body2.fontSize,
    marginBottom: theme.spacing(1),
    color: "var(--mui-palette-text-primary)",
    "&:not(.Mui-error).MuiFormLabel-colorPrimary.Mui-focused": {
      color: "var(--mui-palette-primary-main) !important"
    },
    "&.Mui-disabled": {
      color: "var(--mui-palette-text-disabled)"
    },
    "&.Mui-error": {
      color: "var(--mui-palette-error-main)"
    }
  },
  "& .MuiInputBase-root": {
    backgroundColor: "transparent !important",
    border: `1px solid var(--mui-palette-customColors-inputBorder)`,
    "&:not(.Mui-focused):not(.Mui-disabled):not(.Mui-error):hover": {
      borderColor: "var(--mui-palette-action-active)"
    },
    "&:before, &:after": {
      display: "none"
    },
    "&.MuiInputBase": {
      borderRadius: theme.shape.borderRadius
    },
    "&.Mui-error": {
      borderColor: "var(--mui-palette-error-main)"
    },
    "&.Mui-focused": {
      borderWidth: 2,
      "& .MuiInputBase-input:not(.MuiInputBase-readOnly):not([readonly])::placeholder": {
        transform: "translateX(4px)"
      }
    },
    "&.Mui-disabled": {
      backgroundColor: "var(--mui-palette-action-hover) !important"
    },
    "& .MuiInputBase-input": {
      padding: "7.25px 14px"
    }
  },
  "& .MuiFormHelperText-root": {
    lineHeight: 1.154,
    margin: theme.spacing(1, 0, 0),
    fontSize: theme.typography.body2.fontSize,
    "&.Mui-error": {
      color: "var(--mui-palette-error-main)"
    },
    "&.Mui-disabled": {
      color: "var(--mui-palette-text-disabled)"
    }
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "0px"
  }
}));

const CustomTimePicker = ({
  label,
  format = "HH:mm",
  ampm = false,
  minTime,
  value,
  defaultValue,
  error = false,
  hintText,
  onChange
}: TimePickerProps<PickerValidDate, boolean> & { error?: boolean; hintText?: string }) => {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <StyledTimePicker
          label={
            <Typography variant='subtitle2' color={error ? "error" : "initial"}>
              {label}
            </Typography>
          }
          defaultValue={defaultValue}
          value={value ?? null}
          minTime={minTime}
          format={format}
          ampm={ampm}
          onChange={onChange}
          formatDensity='dense'
        />
        <Typography variant='subtitle2' color={error ? "error" : "initial"}>
          {hintText}
        </Typography>
      </LocalizationProvider>
    </>
  );
};

export default CustomTimePicker;
