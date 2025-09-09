"use client";
import Link from "next/link";

import { MenuItem } from "@mui/material";

import type { Role } from "@prisma/client";

import DropdownButton from "@/components/buttons/DropdownButton";
import DialogAdd from "./components/dialogAdd";
import SingleFileInput from "@/components/file-input/SingleFileInput";
import DatePicker from "@/components/date-picker/DatePicker";
import DateRangePicker from "@/components/date-picker/DateRangePicker";
import TimePicker from "@/components/date-picker/TimePicker";
import RemoteAutocompleteMultiple from "@/components/autocomplete/RemoteAutocompleteMultiple";
import RemoteAutocomplete from "@/components/autocomplete/RemoteAutocomplete";

export default function Page() {
  return (
    <>
      <h1>Home page!</h1>
      <DropdownButton text='Import Data' variant='contained' color='error'>
        <Link href={`/excel_template/Template department.xlsx`} target='_blank'>
          <MenuItem>Template Import</MenuItem>
        </Link>
      </DropdownButton>
      <DialogAdd />
      <SingleFileInput
        accept={{ "image/*": [".jpg", ".png"] }}
        error={true}
        label='Input File'
        helperText='maximum 5mb'
        placeholder='Select File'
      />
      <DatePicker
        className='mb-3'
        label='Tanggal'
        placeholder='Pilih Tanggal'
        format='dd MMMM yyyy'
        error
        helperText='gagalllll'
      />
      <DateRangePicker label='Filter Tanggal' helperText='mangstap' placeholder='Pilih' />
      <TimePicker />
      <TimePicker label='Jam Mulai' error={false} hintText={"mangstap"} />
      <RemoteAutocomplete<Role>
        name='role'
        url='/api/autocomplete/role'
        label='Role'
        placeholder='Pilih Role'
        getOptionLabel={(option) => option.name}
        renderOption={(props, option) => {
          return (
            <div>
              <div>{option?.name}</div>
              <small>{option?.description}</small>
            </div>
          );
        }}
      />
      <RemoteAutocompleteMultiple<Role>
        name='role'
        url='/api/autocomplete/role'
        label='Role'
        placeholder='Pilih Role'
        limitTags={2}
        renderTags={(option) => `${option.name} - ${option.description}`}
        renderOption={(props, option) => {
          return (
            <div>
              <div>{option?.name}</div>
              <small>{option?.description}</small>
            </div>
          );
        }}
      />
    </>
  );
}
