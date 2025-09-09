"use client";
import type { ReactNode, SyntheticEvent } from "react";
import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";

import CustomAutocomplete from "@/@core/components/mui/Autocomplete";
import CustomTextField from "@/@core/components/mui/TextField";
import axiosInstance from "@/client/axiosInstance";

export interface RemoteAutocompleteProps<T extends { id: number | string; label?: string } = any> {
  name: string;

  /** server action : if using server action, url must be undefined */
  action?: (params: any) => Promise<T[]>;

  /** url : if using url, action must be undefined */
  url?: string;

  label?: string;
  placeholder?: string;
  onChange?: (event: SyntheticEvent, selectedOptions: T | null) => void;
  error?: boolean;
  helperText?: ReactNode;
  limit?: number;
  params?: object;
  value?: T | null;
  renderOption?: (props: any, option: T) => JSX.Element;
  getOptionLabel?: (option: T) => string;
  isOptionEqualToValue?: (option: T, value: T) => boolean;
  disabled?: boolean;
  className?: string;
}

const RemoteAutocomplete = <T extends { id: number | string; label?: string } = any>(
  props: RemoteAutocompleteProps<T>
) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500); // Debounce search input
  const [value, setValue] = useState<T | null>(props.value ?? null);
  const [options, setOptions] = useState<T[]>([]);

  // Fetching data based on debounced search value
  const { data, isLoading } = useQuery<T[]>({
    queryKey: [props.name, props.params, "autocomplete-server", debouncedSearch],
    queryFn: async () => {
      const params = { search: debouncedSearch, ...props.params, limit: props.limit ?? 10 };

      if (props.action) {
        const response = await props.action(params);

        return response;
      }

      if (props.url) {
        const response = await axiosInstance.get(`${props.url}`, {
          params: params
        });

        return response.data.data;
      }
    },
    staleTime: 0
  });

  // Handle change event when selecting an option
  const handleOnChange = (event: SyntheticEvent, selectedOptions: T | null) => {
    if (props.onChange) {
      props.onChange(event, selectedOptions);
    }

    setValue(selectedOptions);
  };

  // Set options and update value when data or props.value changes
  useEffect(() => {
    if (data) {
      setOptions(data);
    }
  }, [data]);

  useEffect(() => {
    setValue(props.value ?? null);
  }, [props.value]);

  return (
    <CustomAutocomplete
      className={props.className}
      options={options}
      onChange={handleOnChange}
      loading={isLoading}
      value={value} // Set value as the controlled state
      isOptionEqualToValue={
        props.isOptionEqualToValue
          ? props.isOptionEqualToValue
          : (option, value) => {
              if (!value) {
                return false;
              }

              return option.id === value!.id;
            }
      }
      disabled={props.disabled}
      renderInput={(params) => (
        <CustomTextField
          label={props.label}
          error={props.error}
          helperText={props.helperText}
          {...params}
          onChange={(e) => setSearch(e.target.value)} // Update search term on change
          placeholder={props.placeholder}
        />
      )}
      getOptionLabel={(option) => (props.getOptionLabel ? props.getOptionLabel(option) : option.label ?? "")}
      renderOption={(propsLabel, option) => (
        <Box {...propsLabel} key={"id" + option.id} component='li' sx={{ "& > img": { mr: 2, flexShrink: 0 } }}>
          {props.renderOption ? props.renderOption(propsLabel, option) : option.label}
        </Box>
      )}
    />
  );
};

export default RemoteAutocomplete;
