"use client";
import { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import { Breadcrumbs, Button, Card, CardContent, Grid, IconButton, InputAdornment, Typography } from "@mui/material";

import { useQueryClient } from "@tanstack/react-query";

import CustomTextField from "@/@core/components/mui/TextField";
import axiosInstance from "@/client/axiosInstance";
import useSwal from "@/@core/hooks/useSwal";
import RemoteAutocomplete from "@/components/autocomplete/RemoteAutocomplete";

type Inputs = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  roleId?: number | string | null;
};

export default function Page() {
  const { handleSubmit, register, getValues, formState, setValue, setError, clearErrors } = useForm<Inputs>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [roleId, setRoleId] = useState<{ id: number; label: string } | null>(null);
  const { swalError, swalSuccess } = useSwal();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!data.roleId) {
      setError("roleId", { message: "Role wajib diisi!" });

      return;
    }

    setUploading(true);

    await axiosInstance
      .post("/api/user", {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        roleId: data.roleId
      })
      .then(() => {
        swalSuccess();
        queryClient.invalidateQueries({ queryKey: ["/api/user"] });
        setTimeout(() => {
          router.push("/user");
        }, 1);
      })
      .catch((reason) => {
        if (reason?.response?.data?.message) {
          swalError({ message: reason?.response?.data?.message });
        }

        swalError({ message: "Something went wrong" });
      })
      .finally(() => {
        setUploading(false);
      });
  };

  return (
    <>
      <Breadcrumbs className='mb-5'>
        <Link href={"/user"}>User</Link>
        <Typography sx={{ color: "text.primary" }}>Create New User</Typography>
      </Breadcrumbs>
      <Card>
        <CardContent>
          <h3 className='mb-5 border-bottom'>Create New User</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6} lg={6} xl={6}>
                <CustomTextField
                  label='Nama Lengkap'
                  fullWidth
                  inputProps={{
                    ...register("fullName", { required: { value: true, message: "Nama lengkap wajib diisi!" } })
                  }}
                  error={!!formState.errors.fullName}
                  disabled={uploading}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6} xl={6}>
                <CustomTextField
                  label='Email'
                  fullWidth
                  type='email'
                  inputProps={{
                    ...register("email", {
                      required: { value: true, message: "Email wajib diisi!" },
                      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i
                    })
                  }}
                  error={!!formState.errors.email}
                  disabled={uploading}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6} xl={6}>
                <CustomTextField
                  label='Password'
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  inputProps={{
                    ...register("password", {
                      required: { value: true, message: "Password wajib diisi!" },
                      minLength: { value: 8, message: "Password minimal 8 karakter" }
                    })
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                          <i className={showPassword ? "tabler-eye-off" : "tabler-eye"} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  error={!!formState.errors.password}
                  helperText={formState.errors.password?.message}
                  disabled={uploading}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6} xl={6}>
                <CustomTextField
                  label='Konfirmasi Password'
                  fullWidth
                  type={showConfirmPassword ? "text" : "password"}
                  inputProps={{
                    ...register("confirmPassword", {
                      required: {
                        value: true,
                        message: "Konfirmasi password wajib diisi!"
                      },
                      validate: (value) => value === getValues("password") || "Passwords do not match"
                    })
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          <i className={showConfirmPassword ? "tabler-eye-off" : "tabler-eye"} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  error={!!formState.errors.confirmPassword}
                  helperText={formState.errors.confirmPassword?.message}
                  disabled={uploading}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6} xl={6}>
                <RemoteAutocomplete
                  name='role'
                  label='Role'
                  url='/api/autocomplete/role'
                  value={roleId}
                  onChange={(e, o) => {
                    setValue("roleId", o?.id);
                    setRoleId(o);

                    if (!o) {
                      setError("roleId", { message: "Role wajib diisi!" });
                    } else {
                      clearErrors("roleId");
                    }
                  }}
                  placeholder='administrator'
                  error={!!formState.errors.roleId}
                  helperText={formState.errors.roleId?.message}
                  disabled={uploading}
                  renderOption={(props, option) => {
                    return <div>{option?.label}</div>;
                  }}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={12} xl={12} className='text-end'>
                <Button disabled={uploading} type='submit' variant='contained'>
                  Simpan
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
