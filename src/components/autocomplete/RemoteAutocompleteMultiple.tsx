"use client";

import type { ReactNode, SyntheticEvent } from "react";
import { useEffect, useState } from "react";

import { Box, Chip } from "@mui/material";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";

import CustomAutocomplete from "@/@core/components/mui/Autocomplete";
import CustomTextField from "@/@core/components/mui/TextField";
import axiosInstance from "@/client/axiosInstance";

export interface RemoteAutocompleteMultipleProps<T extends { id: number | string; label?: string } = any> {
  name: string;

  /** server action : if using server action, url must be undefined */
  action?: (params: any) => Promise<T[]>;

  /** url : if using url, action must be undefined */
  url?: string;

  label?: string;
  placeholder?: string;
  onChange?: (event: SyntheticEvent, selectedOptions: T[]) => void;
  error?: boolean;
  helperText?: ReactNode;
  limit?: number;
  params?: object;
  value?: T[];
  renderOption?: (props: any, option: T) => JSX.Element;
  getOptionLabel?: (option: T) => string;
  isOptionEqualToValue?: (option: T, value: T) => boolean;
  disabled?: boolean;
  limitTags?: number;
  renderTags?: (value: T, index: number) => ReactNode;
}

const RemoteAutocompleteMultiple = <T extends { id: number | string; label?: string } = any>(
  props: RemoteAutocompleteMultipleProps<T>
) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500); // Debounce search input
  const [value, setValue] = useState<T[]>(props.value ?? []);
  const [options, setOptions] = useState<T[]>([]);

  // Fetching data based on debounced search value
  const { data, isLoading } = useQuery({
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
  const handleOnChange = (event: SyntheticEvent, selectedOptions: T[]) => {
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
    setValue(props.value ?? []);
  }, [props.value]);

  return (
    <CustomAutocomplete
      multiple
      options={options}
      onChange={handleOnChange}
      loading={isLoading}
      value={value} // Set value as the controlled state
      limitTags={props.limitTags}
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
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => {
          const label = props.renderTags ? props.renderTags(option, index) : option.label;

          return <Chip label={label} {...(getTagProps({ index }) as {})} key={index} size='small' />;
        })
      }
      renderOption={(propsLabel, option) => (
        <Box {...propsLabel} key={"id" + option.id} component='li' sx={{ "& > img": { mr: 2, flexShrink: 0 } }}>
          {props.renderOption ? props.renderOption(propsLabel, option) : option.label}
        </Box>
      )}
    />
  );
};

export default RemoteAutocompleteMultiple;
