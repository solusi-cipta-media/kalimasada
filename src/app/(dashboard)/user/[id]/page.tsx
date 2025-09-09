"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { useRouter, useParams } from "next/navigation";

import { Breadcrumbs, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { Role } from "@prisma/client";

import axiosInstance from "@/client/axiosInstance";
import useLoadingBlock from "@/@core/hooks/useLoadingBlock";
import CustomTextField from "@/@core/components/mui/TextField";
import useSwal from "@/@core/hooks/useSwal";
import RemoteAutocomplete from "@/components/autocomplete/RemoteAutocomplete";

type Inputs = {
  fullName: string;
  email: string;
  roleId?: number | string | null;
};

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const { stopLoading, startLoading } = useLoadingBlock(true);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();
  const { swalSuccess, swalError } = useSwal();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["get-user-by-id"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/api/user/" + id);

        return response.data as {
          message: string;
          data: {
            fullName: string;
            email: string;
            id: number;
            role: Role | null;
          };
        };
      } catch (error) {
        router.push("/user");

        return undefined;
      }
    },
    staleTime: undefined,
    gcTime: undefined
  });

  const [roleValue, setRoleValue] = useState<Role | null>(null);

  const { handleSubmit, register, formState, setValue } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setUploading(true);

    try {
      await axiosInstance.put("/api/user/" + id, data);

      swalSuccess({
        title: "Success",
        message: "User updated successfully"
      });

      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      refetch();
    } catch (error: any) {
      if (error.response?.data?.message) {
        swalError({
          title: "Error",
          message: error.response.data.message
        });
      } else {
        swalError({
          title: "Error",
          message: "Something went wrong"
        });
      }
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      stopLoading();

      return;
    }

    startLoading();
  }, [isLoading, stopLoading, startLoading]);

  useEffect(() => {
    if (data?.data) {
      setValue("fullName", data?.data.fullName);
      setValue("email", data?.data.email);
      setValue("roleId", data?.data.role?.id);

      if (!data?.data.role) {
        setRoleValue(null);
      } else {
        setRoleValue(data.data.role);
      }
    }
  }, [data, setValue]);

  return (
    <>
      {data && (
        <Breadcrumbs className='mb-5'>
          <Link href={"/user"}>User</Link>
          <Typography sx={{ color: "text.primary" }}>{data?.data.fullName}</Typography>
        </Breadcrumbs>
      )}
      {data && (
        <Card>
          <CardContent>
            <Grid container justifyContent={"space-between"} justifyItems={"center"}>
              <h2>{data?.data.fullName}</h2>
              <div>
                <Button variant='contained' size='small' className='me-2' LinkComponent={Link} href={"/user"}>
                  <i className='tabler-arrow-left me-2'></i> Back
                </Button>
              </div>
            </Grid>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={5} className='mt-4'>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label='Nama Lengkap'
                    inputProps={{ ...register("fullName", { required: "Wajib diisi" }) }}
                    error={Boolean(formState.errors.fullName)}
                    fullWidth
                    helperText={formState.errors.fullName?.message}
                    disabled={uploading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label='Email'
                    inputProps={{ ...register("email", { required: "Wajib diisi" }) }}
                    type='email'
                    error={Boolean(formState.errors.email)}
                    fullWidth
                    helperText={formState.errors.email?.message}
                    disabled={uploading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RemoteAutocomplete<Role>
                    name='role'
                    url='/api/autocomplete/role'
                    label='Role'
                    onChange={(e, o) => {
                      setValue("roleId", o?.id);
                      setRoleValue(o);
                    }}
                    value={roleValue}
                    disabled={uploading}
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
                </Grid>
                <Grid item xs={12} className='text-end'>
                  <Button type='submit' variant='contained' color='primary' disabled={uploading} size='small'>
                    <i className='tabler-device-floppy me-2'></i> Save
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
