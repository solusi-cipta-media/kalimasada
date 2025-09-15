import Swal from "sweetalert2";

// Custom SweetAlert2 configuration for consistent styling
export const swalConfig = {
  // Primary theme colors that match your app
  confirmButtonColor: "#7367F0", // Primary color
  cancelButtonColor: "#8E8E93", // Secondary color

  // Custom class for theming
  customClass: {
    popup: "swal-popup",
    title: "swal-title",
    content: "swal-content",
    confirmButton: "swal-confirm-btn",
    cancelButton: "swal-cancel-btn"
  },

  // Animation settings
  showClass: {
    popup: "animate__animated animate__fadeInDown"
  },
  hideClass: {
    popup: "animate__animated animate__fadeOutUp"
  }
};

// Confirmation dialog presets
export const confirmDialog = {
  delete: (itemName?: string) => ({
    title: "Konfirmasi Hapus",
    text: itemName ? `Apakah Anda yakin ingin menghapus "${itemName}"?` : "Apakah Anda yakin ingin menghapus data ini?",
    icon: "warning" as const,
    showCancelButton: true,
    confirmButtonText: "Ya, Hapus",
    cancelButtonText: "Batal",
    reverseButtons: true,
    focusCancel: true,
    ...swalConfig
  }),

  payment: (amount?: string, employeeName?: string) => ({
    title: "Konfirmasi Pembayaran",
    text: employeeName
      ? `Apakah Anda yakin ingin membayar gaji ${employeeName}${amount ? ` sebesar ${amount}` : ""}?`
      : `Apakah Anda yakin ingin melakukan pembayaran${amount ? ` sebesar ${amount}` : ""}?`,
    icon: "question" as const,
    showCancelButton: true,
    confirmButtonText: "Ya, Bayar",
    cancelButtonText: "Batal",
    reverseButtons: true,
    ...swalConfig
  }),

  payAll: (count?: number, totalAmount?: string) => ({
    title: "Konfirmasi Pembayaran Semua",
    text: `Apakah Anda yakin ingin membayar semua gaji${count ? ` (${count} karyawan)` : ""}${totalAmount ? ` dengan total ${totalAmount}` : ""}?`,
    icon: "question" as const,
    showCancelButton: true,
    confirmButtonText: "Ya, Bayar Semua",
    cancelButtonText: "Batal",
    reverseButtons: true,
    ...swalConfig
  }),

  logout: () => ({
    title: "Konfirmasi Logout",
    text: "Apakah Anda yakin ingin keluar dari aplikasi?",
    icon: "question" as const,
    showCancelButton: true,
    confirmButtonText: "Ya, Logout",
    cancelButtonText: "Batal",
    reverseButtons: true,
    ...swalConfig
  }),

  save: (itemName?: string) => ({
    title: "Konfirmasi Simpan",
    text: itemName
      ? `Apakah Anda yakin ingin menyimpan "${itemName}"?`
      : "Apakah Anda yakin ingin menyimpan perubahan?",
    icon: "question" as const,
    showCancelButton: true,
    confirmButtonText: "Ya, Simpan",
    cancelButtonText: "Batal",
    reverseButtons: true,
    ...swalConfig
  }),

  generate: (itemName?: string) => ({
    title: "Konfirmasi Generate",
    text: itemName ? `Apakah Anda yakin ingin generate ${itemName}?` : "Apakah Anda yakin ingin generate data?",
    icon: "question" as const,
    showCancelButton: true,
    confirmButtonText: "Ya, Generate",
    cancelButtonText: "Batal",
    reverseButtons: true,
    ...swalConfig
  })
};

// Success notifications
export const successAlert = {
  simple: (message: string) => ({
    title: "Berhasil!",
    text: message,
    icon: "success" as const,
    confirmButtonText: "OK",
    ...swalConfig
  }),

  timer: (message: string, timer = 2000) => ({
    title: "Berhasil!",
    text: message,
    icon: "success" as const,
    timer,
    showConfirmButton: false,
    ...swalConfig
  })
};

// Error notifications
export const errorAlert = {
  simple: (message: string) => ({
    title: "Error!",
    text: message,
    icon: "error" as const,
    confirmButtonText: "OK",
    ...swalConfig
  }),

  network: () => ({
    title: "Kesalahan Jaringan!",
    text: "Terjadi kesalahan jaringan. Silakan coba lagi.",
    icon: "error" as const,
    confirmButtonText: "OK",
    ...swalConfig
  })
};

// Info notifications
export const infoAlert = {
  simple: (message: string) => ({
    title: "Informasi",
    text: message,
    icon: "info" as const,
    confirmButtonText: "OK",
    ...swalConfig
  })
};

// Loading dialog
export const loadingAlert = {
  show: (message = "Memproses...") => {
    Swal.fire({
      title: message,
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
      ...swalConfig
    });
  },

  close: () => {
    Swal.close();
  }
};
