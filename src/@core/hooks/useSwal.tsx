import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { useTheme } from "@mui/material";

export function useSwalSaveSuccess() {
  const { palette } = useTheme();

  const showSwal = (options?: { title?: string; message?: string }) => {
    const MySwal = withReactContent(Swal);

    MySwal.fire({
      title: options?.title ?? "Success",
      text: options?.message ?? "Data saved successfully",
      icon: "success",
      confirmButtonText: "Ok",
      color: palette.text.primary,
      background: palette.background.default
    });
  };

  return {
    showSwal
  };
}

export function useSwalConfirmDelete() {
  const { palette } = useTheme();

  const showSwal = (options?: { title?: string; message?: string }) => {
    const MySwal = withReactContent(Swal);

    return MySwal.fire({
      title: options?.title ?? "Are you sure?",
      text: options?.message ?? "You won't be able to revert this",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      color: palette.text.primary,
      background: palette.background.default
    });
  };

  return {
    showSwal
  };
}

export function useSwalConfirm() {
  const { palette } = useTheme();

  const showSwal = (options?: { title?: string; message?: string }) => {
    const MySwal = withReactContent(Swal);

    return MySwal.fire({
      title: options?.title ?? "Are you sure?",
      text: options?.message ?? "Confirm to proceed",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: palette.success.main,
      cancelButtonColor: palette.error.main,
      confirmButtonText: "Konfirmasi",
      cancelButtonText: "Batal",
      color: palette.text.primary,
      background: palette.background.default
    });
  };

  return {
    showSwal
  };
}

export function useSwalError() {
  const { palette } = useTheme();

  const showSwal = (options?: { title?: string; message?: string; confirmButtonText?: string }) => {
    const MySwal = withReactContent(Swal);

    MySwal.fire({
      title: options?.title ?? "Error",
      text: options?.message ?? "Something went wrong",
      icon: "error",
      confirmButtonText: "Ok",
      confirmButtonColor: "#d33",
      color: palette.text.primary,
      background: palette.background.default
    });
  };

  return {
    showSwal
  };
}

export default function useSwal() {
  const { palette } = useTheme();

  const swalConfirm = (options?: {
    title?: string;
    message?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
  }) => {
    const MySwal = withReactContent(Swal);

    return MySwal.fire({
      title: options?.title ?? "Are you sure?",
      text: options?.message ?? "You won't be able to revert this",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: options?.confirmButtonText ?? "Konfirmasi",
      cancelButtonText: options?.cancelButtonText ?? "Batal",
      color: palette.text.primary,
      background: palette.background.default
    });
  };

  const swalConfirmDelete = (options?: {
    title?: string;
    message?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
  }) => {
    const MySwal = withReactContent(Swal);

    return MySwal.fire({
      title: options?.title ?? "Are you sure?",
      text: options?.message ?? "You won't be able to revert this",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: options?.confirmButtonText ?? "Hapus",
      cancelButtonText: options?.cancelButtonText ?? "Batal",
      color: palette.text.primary,
      background: palette.background.default
    });
  };

  const swalSuccess = (options?: { title?: string; message?: string }) => {
    const MySwal = withReactContent(Swal);

    MySwal.fire({
      title: options?.title ?? "Success",
      text: options?.message ?? "Data saved successfully",
      icon: "success",
      confirmButtonText: "Ok",
      color: palette.text.primary,
      background: palette.background.default
    });
  };

  const swalError = (options?: { title?: string; message?: string }) => {
    const MySwal = withReactContent(Swal);

    MySwal.fire({
      title: options?.title ?? "Error",
      text: options?.message ?? "Something went wrong",
      icon: "error",
      confirmButtonText: "Ok",
      confirmButtonColor: "#d33",
      color: palette.text.primary,
      background: palette.background.default
    });
  };

  return { swalConfirm, swalConfirmDelete, swalSuccess, swalError };
}
