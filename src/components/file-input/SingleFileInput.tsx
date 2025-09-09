"use client";

// React Imports
import { useEffect, useState } from "react";

// MUI Imports
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FormHelperText, Grid, InputLabel } from "@mui/material";

// Third-party Imports
import { type Accept, useDropzone } from "react-dropzone";
import classNames from "classnames";

interface Props {
  height?: number;
  label?: string;
  placeholder?: string;
  accept?: Accept;
  error?: boolean;
  helperText?: string;
  className?: string;
  onChange?: (file: File | null) => void;
}

const SingleFileInput = (props: Props) => {
  // States
  const [files, setFiles] = useState<File[]>([]);

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: props.accept,
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)));
    }
  });

  const img = files.map((file: File) => (
    <img key={file.name} alt={file.name} className='single-file-image' src={URL.createObjectURL(file as any)} />
  ));

  useEffect(() => {
    if (props.onChange) {
      props.onChange(files.length ? files[0] : null);
    }
  }, [files, props]);

  return (
    <div className={props.className}>
      <InputLabel className={classNames("text-sm mb-1", props.error ? "text-error" : "")}>{props.label}</InputLabel>
      <Box
        className={classNames("dropzone", props.error ? "border-error" : "")}
        {...getRootProps()}
        sx={{
          height: props.height ?? 100
        }}
      >
        <input {...getInputProps()} />
        {files.length ? (
          img
        ) : (
          <Grid container direction={"column"} justifyContent={"center"} alignItems={"center"}>
            <Grid item>
              <i className='tabler-file' />
            </Grid>
            <Grid item>
              <Typography>{props.placeholder ?? "Pilih File"}</Typography>
            </Grid>
          </Grid>
        )}
      </Box>
      <FormHelperText className='mt-1' error={props.error}>
        {props.helperText}
      </FormHelperText>
    </div>
  );
};

export default SingleFileInput;
