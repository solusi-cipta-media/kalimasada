"use client";
import { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography
} from "@mui/material";

import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import { useQueryClient } from "@tanstack/react-query";

import CustomTextField from "@/@core/components/mui/TextField";
import { useSwalError, useSwalSaveSuccess } from "@/@core/hooks/useSwal";
import axiosInstance from "@/client/axiosInstance";
import RoleAccessView from "@/views/RoleAccessView";

interface Inputs {
  name: string;
  description: string;
  byPassAllFeatures: boolean;
  permissionIds: number[];
}

export default function Page() {
  const queryClient = useQueryClient();

  const { register, formState, handleSubmit, watch, getValues, setValue } = useForm<Inputs>({
    defaultValues: { permissionIds: [] }
  });

  const { showSwal: showSuccess } = useSwalSaveSuccess();
  const { showSwal: showError } = useSwalError();
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setUploading(true);

    try {
      await axiosInstance.post("/api/role", data);

      showSuccess({
        title: "Sukes",
        message: "Role berhasil disimpan."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/role"] });
      queryClient.invalidateQueries({ queryKey: ["/api/autocomplete/role"] });
      router.push("/role");
    } catch (error: any) {
      if (error.response?.data?.message) {
        showError({
          title: "Error",
          message: error.response.data.message
        });
      } else {
        showError({
          title: "Error",
          message: "Something went wrong"
        });
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Breadcrumbs className='mb-5'>
        <Link href={"/role"}>Role</Link>
        <Typography sx={{ color: "text.primary" }}>Create New Role</Typography>
      </Breadcrumbs>
      <Card>
        <CardContent>
          <Typography variant='h5' component='div'>
            Create New Role
          </Typography>
          <Typography sx={{ mb: 4 }} color='text.secondary'>
            Role Name mandatory, description (optional)
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6} lg={6} xl={6}>
                <CustomTextField
                  label='Role Name'
                  name='roleName'
                  id='roleName'
                  placeholder='Role Name'
                  inputProps={{ ...register("name", { required: { value: true, message: "Wajib diisi!" } }) }}
                  error={Boolean(formState.errors.name)}
                  disabled={uploading}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6} xl={6}>
                <CustomTextField
                  label='Role Description'
                  name='roleDescription'
                  id='roleDescription'
                  placeholder='Role Description'
                  inputProps={{ ...register("description") }}
                  disabled={uploading}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6} xl={6}>
                <FormGroup>
                  <FormControlLabel
                    label='Bypass Semua Fitur'
                    control={<Checkbox {...register("byPassAllFeatures")} />}
                  />
                </FormGroup>
                <small className='text-secondary'>
                  Jika anda mengaktifkan fitur ini, maka user dengan role ini akan dapat mengakses semua fitur.
                </small>
              </Grid>
              <Grid item xs={12}>
                <Box border={"darkgray"}>
                  <h3 className='mb-3'>Hak Akses</h3>
                  <Card>
                    <CardContent>
                      <RoleAccessView
                        byPass={watch("byPassAllFeatures")}
                        chosenAccess={watch("permissionIds")}
                        onChangeItem={(access) => {
                          if (getValues("permissionIds").includes(access.id) && access.set == "remove") {
                            setValue(
                              "permissionIds",
                              getValues("permissionIds").filter((item) => item !== access.id)
                            );
                          }

                          if (!getValues("permissionIds").includes(access.id) && access.set == "add") {
                            setValue("permissionIds", [...getValues("permissionIds"), access.id]);
                          }
                        }}
                      />
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
              <Grid item xs={12} md={12} lg={12} xl={12} className='text-end'>
                <Button type='submit' variant='contained' disabled={uploading} size='small'>
                  <i className='tabler-device-floppy me-2'></i> Save
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
