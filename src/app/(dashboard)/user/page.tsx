"use client";

import { useRef } from "react";

import Link from "next/link";

import { Box, Breadcrumbs, Button, Card, CardContent, Grid, TableCell, TableRow, Typography } from "@mui/material";

import { useSwalConfirmDelete, useSwalSaveSuccess } from "@/@core/hooks/useSwal";
import axiosInstance from "@/client/axiosInstance";
import useLoadingBlock from "@/@core/hooks/useLoadingBlock";
import type { DatatableRef } from "@/components/table/Datatable";
import Datatable from "@/components/table/Datatable";

export default function Page() {
  const swalConfirm = useSwalConfirmDelete();
  const swalSuccess = useSwalSaveSuccess();
  const { startLoading, stopLoading } = useLoadingBlock(false);

  const datatableRef = useRef<DatatableRef>(null);

  const handleDelete = async (id: number) => {
    const swal = await swalConfirm.showSwal();

    if (!swal.isConfirmed) return;
    startLoading();

    try {
      await axiosInstance.delete(`/api/user/${id}`).then(() => {});
      datatableRef.current?.reload();
      swalSuccess.showSwal({
        title: "Success",
        message: "User deleted successfully"
      });
    } catch (error) {}

    stopLoading();
  };

  return (
    <Box display={"flex"} flexDirection={"column"} gap={6}>
      <Breadcrumbs
        separator={
          <Typography variant='h4' color={"GrayText"}>
            /
          </Typography>
        }
      >
        <Typography variant='h4' color={"GrayText"}>
          Master
        </Typography>
        <Typography variant='h4'>User</Typography>
      </Breadcrumbs>

      <Card>
        <CardContent>
          <Grid container spacing={2} justifyContent={"space-between"}>
            <div>
              <Typography variant='h5' component='div'>
                User
              </Typography>
              <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                User management, tekan tombol <span className='text-primary'>Tambah</span> untuk menambahkan user baru.
              </Typography>
            </div>
            <div className='text-end'>
              <Button variant='contained' LinkComponent={Link} href='/user/create'>
                Tambah
              </Button>
            </div>
          </Grid>
          <Datatable
            name='table-user'
            ref={datatableRef}
            url='/api/user'
            tableHeaders={[
              {
                name: "Name",
                orderable: true,
                key: "fullName"
              },
              {
                name: "Email",
                orderable: true,
                key: "email"
              },
              {
                name: "Action",
                className: "text-center"
              }
            ]}
            renderRows={(
              data: {
                id: number;
                email: string;
                fullName: string;
              }[]
            ) => {
              return data.map((item) => (
                <TableRow key={`user-${item.id}`}>
                  <TableCell>
                    <Link href={`/user/${item.id}`}>{item.fullName}</Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/user/${item.id}`}>{item.email}</Link>
                  </TableCell>
                  <TableCell className='text-center'>
                    <Button variant='outlined' size='small' LinkComponent={Link} href={`/user/${item.id}`}>
                      View
                    </Button>
                    <Button variant='outlined' color='error' size='small' onClick={() => handleDelete(item.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ));
            }}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
