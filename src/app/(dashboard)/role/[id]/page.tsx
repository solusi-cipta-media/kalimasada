"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import Link from "next/link";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useForm } from "react-hook-form";

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

import useLoadingBlock from "@/@core/hooks/useLoadingBlock";
import axiosInstance from "@/client/axiosInstance";
import CustomTextField from "@/@core/components/mui/TextField";
import useSwal from "@/@core/hooks/useSwal";
import RoleAccessView from "@/views/RoleAccessView";

type Inputs = {
  name: string;
  description?: string;
  byPassAllFeatures: boolean;
};

export default function Page() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const { stopLoading, startLoading } = useLoadingBlock(false);
  const [uploading, setUploading] = useState(false);

  // unhandled fields
  const [bypass, setBypass] = useState<boolean>(false);

  const { swalSuccess, swalError } = useSwal();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["get-role-by-id"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/api/role/" + id);

        return response.data as {
          message: string;
          data: {
            name: string;
            description?: string;
            id: number;
            byPassAllFeatures: boolean;
            access: number[];
          };
        };
      } catch (error) {
        router.push("/role");

        return undefined;
      }
    },
    staleTime: undefined,
    gcTime: undefined
  });

  const [accessUpdate, setAccessUpdate] = useState<number[]>([]);

  const { handleSubmit, register, formState, setValue } = useForm<Inputs>();

  const onSubmit = async (inputs: Inputs) => {
    setUploading(true);

    try {
      await axiosInstance.put("/api/role/" + id, { ...inputs, accessIds: accessUpdate });

      queryClient.invalidateQueries({ queryKey: ["/api/role"] });
      refetch();
      swalSuccess({ message: "Data berhasil disimpan" });
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
      setValue("name", data?.data.name ?? "");
      setValue("description", data?.data.description ?? "");

      setValue("byPassAllFeatures", data?.data.byPassAllFeatures ?? false);
      setBypass(data?.data.byPassAllFeatures ?? false);
      setAccessUpdate(data?.data.access ?? []);
    }
  }, [data, setValue]);

  return (
    <>
      {data && (
        <Breadcrumbs className='mb-5'>
          <Link href={"/role"}>Role</Link>
          <Typography sx={{ color: "text.primary" }}>{data?.data.name}</Typography>
        </Breadcrumbs>
      )}
      {data && (
        <Card>
          <CardContent>
            <Grid container justifyContent={"space-between"} justifyItems={"center"}>
              <h2>{data?.data.name}</h2>
              <div>
                <Link href={"/role"}>
                  <Button variant='contained' size='small' className='me-2'>
                    <i className='tabler-arrow-left me-2'></i> Back
                  </Button>
                </Link>
              </div>
            </Grid>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={5} className='mt-4'>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label='Role Name'
                    inputProps={{ ...register("name", { required: "Wajib diisi" }) }}
                    error={Boolean(formState.errors.name)}
                    fullWidth
                    helperText={formState.errors.name?.message}
                    disabled={uploading}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    label='Role Description'
                    inputProps={{ ...register("description", { required: "Wajib diisi" }) }}
                    type='text'
                    error={Boolean(formState.errors.description)}
                    fullWidth
                    helperText={formState.errors.description?.message}
                    disabled={uploading}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6} xl={6}>
                  <FormGroup>
                    <FormControlLabel
                      label='Bypass Semua Fitur'
                      control={
                        <Checkbox
                          checked={bypass}
                          {...register("byPassAllFeatures")}
                          onChange={(e) => {
                            setBypass(e.target.checked);
                            setValue("byPassAllFeatures", e.target.checked);
                          }}
                        />
                      }
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
                        {data?.data.access && (
                          <RoleAccessView
                            byPass={bypass}
                            chosenAccess={accessUpdate}
                            onChangeItem={(access) => {
                              if (accessUpdate.includes(access.id) && access.set == "remove") {
                                setAccessUpdate(accessUpdate.filter((item) => item !== access.id));
                              }

                              if (!accessUpdate.includes(access.id) && access.set == "add") {
                                setAccessUpdate([...accessUpdate, access.id]);
                              }
                            }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </Box>
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
