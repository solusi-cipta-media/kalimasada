"use client";

import { useRef } from "react";

import Link from "next/link";

import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Checkbox,
  Grid,
  TableCell,
  TableRow,
  Typography
} from "@mui/material";

import useLoadingBlock from "@/@core/hooks/useLoadingBlock";
import { useSwalConfirmDelete, useSwalError, useSwalSaveSuccess } from "@/@core/hooks/useSwal";
import axiosInstance from "@/client/axiosInstance";
import type { DatatableRef } from "@/components/table/Datatable";
import Datatable from "@/components/table/Datatable";

export default function Page() {
  const { startLoading, stopLoading } = useLoadingBlock(false);
  const { showSwal: swalConfirm } = useSwalConfirmDelete();
  const { showSwal: swalSuccess } = useSwalSaveSuccess();
  const { showSwal: swalError } = useSwalError();

  const ref = useRef<DatatableRef>(null);

  const handleDelete = async (id: number) => {
    const swal = await swalConfirm({ title: "Anda yakin?", message: "Data ini akan terhapus secara permanent" });

    if (!swal.isConfirmed) {
      return;
    }

    startLoading();

    try {
      await axiosInstance.delete(`/api/role/${id}`);
      swalSuccess({
        title: "Success",
        message: "Role telah dihapus"
      });
      ref.current?.reload();
    } catch (error: any) {
      if (error.response?.data?.message) {
        swalError({
          title: "Error",
          message: error.response.data.message
        });

        return;
      }

      swalError({
        title: "Error",
        message: "Something went wrong"
      });
    } finally {
      stopLoading();
    }
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
        <Typography variant='h4'>Role</Typography>
      </Breadcrumbs>

      <Card>
        <CardContent>
          <Grid container spacing={2} justifyContent={"space-between"}>
            <div>
              <Typography variant='h5' component='div'>
                Role
              </Typography>
              <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                Role management, tekan tombol <span className='text-primary'>Add Role</span> untuk menambahkan role
                baru.
              </Typography>
            </div>
            <div className='text-end'>
              <Link href={"/role/create"}>
                <Button variant='contained'>Add Role</Button>
              </Link>
            </div>
          </Grid>
          <Datatable
            name='table-role'
            url='/api/role'
            ref={ref}
            tableHeaders={[
              {
                name: "Name",
                key: "name",
                orderable: true
              },
              {
                name: "Description",
                key: "description",
                orderable: true
              },
              {
                name: "Bypass Akses",
                key: "byPassAllFeatures",
                orderable: true
              },
              {
                name: "Action",
                className: "text-center"
              }
            ]}
            renderRows={(
              data: {
                id: number;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                byPassAllFeatures: boolean;
              }[]
            ) => {
              return data.map((item) => (
                <TableRow key={`role-${item.id}`}>
                  <TableCell>
                    <Link href={`/role/${item.id}`}>{item.name}</Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/role/${item.id}`}>{item.description}</Link>
                  </TableCell>
                  <TableCell>
                    <Checkbox checked={item.byPassAllFeatures} disabled />
                  </TableCell>
                  <TableCell className='text-center'>
                    <Link href={`/role/${item.id}`}>
                      <Button variant='outlined' size='small' className='me-2'>
                        Edit
                      </Button>
                    </Link>
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
