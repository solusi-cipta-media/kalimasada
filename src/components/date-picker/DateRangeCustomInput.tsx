import React, { forwardRef } from "react";

import { InputAdornment } from "@mui/material";
import moment from "moment";

import CustomTextField from "@/@core/components/mui/TextField";

interface DateRangeCustomInputProps {
  label?: string;
  start: Date | number | null;
  end: Date | number | null;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
}

const DateRangeCustomInput = forwardRef<HTMLInputElement, DateRangeCustomInputProps>(
  ({ label, start, end, error, helperText, ...rest }, ref) => {
    const formatDate = (date: Date | number | null) => (date ? moment(date).format("DD MMM YYYY") : null);

    const startDate = formatDate(start);
    const endDate = formatDate(end);

    const value = `${startDate ?? ""}${endDate ? ` - ${endDate}` : ""}`;

    return (
      <CustomTextField
        fullWidth
        inputRef={ref}
        {...rest}
        label={label}
        value={value}
        InputProps={{
          autoComplete: "off",
          endAdornment: (
            <InputAdornment position='end'>
              <i className='tabler-calendar' />
            </InputAdornment>
          )
        }}
        error={error}
        helperText={helperText}
      />
    );
  }
);

export default DateRangeCustomInput;
