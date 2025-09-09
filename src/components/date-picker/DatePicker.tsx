"use client";
import { useState } from "react";

import { id } from "date-fns/locale/id";

import { InputAdornment } from "@mui/material";

import AppReactDatepicker from "@/@libs/styles/AppReactDatepicker";
import CustomTextField from "@/@core/components/mui/TextField";

interface Props {
  value?: Date;
  label?: string;
  placeholder?: string;
  format?: string;
  className?: string;
  onChange?: (date: Date | null) => void;
  error?: boolean;
  helperText?: string;
  disableInput?: boolean;

  /** it will set to year picker if true */
  showYearPicker?: boolean;
}

const CustomDatePicker = (props: Props) => {
  const [date, setDate] = useState<Date | null>(props?.value ?? null);

  const handleChange = (date: Date | null) => {
    setDate(date);

    if (props.onChange) {
      props.onChange(date);
    }
  };

  return (
    <AppReactDatepicker
      className={props.className}
      selected={date}
      locale={id}
      dateFormat={props.format}
      showYearPicker={props.showYearPicker}
      onChange={handleChange}
      placeholderText={props.placeholder}
      customInput={
        <CustomTextField
          label={props.label}
          fullWidth
          error={props.error}
          helperText={props.helperText}
          InputProps={{
            readOnly: props.disableInput,
            autoComplete: "off",
            endAdornment: (
              <InputAdornment position='end'>
                <i className='tabler-calendar' />
              </InputAdornment>
            )
          }}
        />
      }
    />
  );
};

export default CustomDatePicker;
