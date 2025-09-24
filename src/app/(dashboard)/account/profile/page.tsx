"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import { format } from "date-fns";
import { id } from "date-fns/locale";

import {
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  Typography
} from "@mui/material";

import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import { useProfile } from "@core/hooks/useProfile";
import CustomTextField from "@/@core/components/mui/TextField";
import useSnackBar from "@/@core/hooks/useSnackBar";
import readFileUpload from "@/@core/utils/readFileUpload";
import axiosMultipartInstance from "@/client/axiosMultipartInstance";

// import axiosInstance from "@/client/axiosInstance";

type Inputs = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatar: File | null;
};

export default function Page() {
  const { data, isLoading, refreshProfile } = useProfile();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const avatarRef = useRef<HTMLInputElement | null>(null);

  const { SnackBar: SuccessSnackBar, openSnackBar: openSuccessSnackBar } = useSnackBar({
    severity: "success",
    message: "Your Profile updated successfully!"
  });

  const {
    SnackBar: ErrorSnackBar,
    openSnackBar: openErrorSnackBar,
    setMessage: setMessageError
  } = useSnackBar({
    severity: "error",
    message: "Update Profile failed!"
  });

  const { handleSubmit, register, setValue, getValues, formState } = useForm<Inputs>({
    defaultValues: {
      fullName: data?.fullName || "",
      email: data?.email || "",
      password: "",
      confirmPassword: "",
      avatar: null
    }
  });

  useEffect(() => {
    if (data) {
      setValue("fullName", data.fullName || "");
      setValue("email", data.email || "");
    }
  }, [data, setValue]);

  // Handle Avatar
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setValue("avatar", file);
      const reader = new FileReader();

      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  // Handle Cancel Image
  const handleDeleteImage = () => {
    setValue("avatar", null);
    setAvatar(null);

    if (avatarRef.current) {
      avatarRef.current.value = "";
    }
  };

  // Handle Form
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setUploading(true);

    const formData = new FormData();

    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    if (data.password) formData.append("password", data.password);

    if (data.avatar instanceof File) {
      formData.append("avatar", data.avatar);
    }

    await axiosMultipartInstance
      .patch("/api/account/profile", formData)
      .then(() => {
        openSuccessSnackBar();
        refreshProfile();
        handleDeleteImage();
      })
      .catch((reason) => {
        if (reason?.response?.data?.message) {
          setMessageError(reason?.response?.data?.message);
        }

        openErrorSnackBar();
        handleDeleteImage();
      })
      .finally(() => {
        setUploading(false);
      });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      {SuccessSnackBar}
      {ErrorSnackBar}

      <Breadcrumbs className='mb-5'>
        <Link href={"#"}>Account</Link>
        <Typography>My Profile</Typography>
      </Breadcrumbs>

      <Grid container spacing={6}>
        <Grid item md={4}>
          <Card>
            <CardHeader title='Information' />
            <CardContent>
              <List className='py-0'>
                <ListItem className='px-0'>
                  <img
                    src={data?.avatar ? `${readFileUpload(data.avatar)}` : "/images/avatars/1.png"}
                    alt='Avatar'
                    style={{ width: 100, height: 100, borderRadius: "5%", objectFit: "cover" }}
                  />
                </ListItem>
                <ListItem className='px-0'>
                  <i className='tabler-user text-[22px]' />
                  <Typography>{data?.fullName}</Typography>
                </ListItem>
                <ListItem className='px-0'>
                  <i className='tabler-mail text-[22px]' />
                  <Typography>{data?.email}</Typography>
                </ListItem>
                <ListItem className='px-0'>
                  <i className='tabler-calendar-clock text-[22px]' />
                  <Typography>
                    {data?.createdAt ? format(new Date(data.createdAt), "dd MMMM yyyy HH:mm", { locale: id }) : "-"}
                  </Typography>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item md={8}>
          <Card>
            <CardHeader title='Update Profile' />
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <CustomTextField
                        label='Profile Picture (Avatar)'
                        fullWidth
                        inputProps={{
                          type: "file",
                          accept: "image/*",
                          onChange: handleImageChange
                        }}
                        inputRef={avatarRef}
                        error={!!formState.errors.avatar}
                        helperText={formState.errors.avatar?.message}
                      />
                      {avatar && (
                        <>
                          <img src={avatar} alt='Profile Preview' style={{ maxWidth: "50%", marginTop: "10px" }} />
                          <Button
                            variant='tonal'
                            color='warning'
                            style={{ marginTop: "10px" }}
                            onClick={handleDeleteImage}
                          >
                            Clear Image
                          </Button>
                        </>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <CustomTextField
                      label='Nama Lengkap'
                      fullWidth
                      inputProps={{
                        ...register("fullName", { required: { value: true, message: "Nama lengkap wajib diisi!" } })
                      }}
                      error={!!formState.errors.fullName}
                    />
                  </Grid>
                  <Grid item xs={12}>
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
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomTextField
                      label='Password'
                      fullWidth
                      type={showPassword ? "text" : "password"}
                      inputProps={{
                        ...register("password", {
                          required: { value: false, message: "Password wajib diisi!" },
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
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomTextField
                      label='Konfirmasi Password'
                      fullWidth
                      type={showConfirmPassword ? "text" : "password"}
                      inputProps={{
                        ...register("confirmPassword", {
                          required: {
                            value: false,
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
                    />
                  </Grid>
                  <Grid item xs={12} md={12} lg={12} xl={12} className='text-end'>
                    <Button disabled={uploading} type='submit' variant='contained'>
                      {uploading ? "Menyimpan..." : "Simpan"}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
