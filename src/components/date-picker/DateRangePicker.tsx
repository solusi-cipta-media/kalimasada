"use client";

import React, { useState } from "react";

import { id } from "date-fns/locale/id";

import AppReactDatepicker from "@/@libs/styles/AppReactDatepicker";
import type { DateRange } from "@/types/DateRange";
import DateRangeCustomInput from "./DateRangeCustomInput";

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (data: DateRange) => void;
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
}

const DateRangePicker = ({ value, onChange, label, placeholder, error, helperText }: DateRangePickerProps) => {
  const [startDateRange, setStartDateRange] = useState<Date | null>(value?.startDate ?? null);
  const [endDateRange, setEndDateRange] = useState<Date | null>(value?.endDate ?? null);

  const handleOnChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;

    setStartDateRange(start);
    setEndDateRange(end);

    if (onChange) {
      onChange({ startDate: start, endDate: end });
    }
  };

  return (
    <AppReactDatepicker
      selectsRange
      placeholderText={placeholder}
      startDate={startDateRange}
      endDate={endDateRange}
      selected={startDateRange}
      onChange={handleOnChange}
      shouldCloseOnSelect={false}
      locale={id}
      customInput={
        <DateRangeCustomInput
          label={label}
          start={startDateRange}
          end={endDateRange}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
        />
      }
      id='date-range-picker'
    />
  );
};

export default DateRangePicker;
