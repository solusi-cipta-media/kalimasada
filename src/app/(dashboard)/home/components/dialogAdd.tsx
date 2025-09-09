"use client";

import { useState } from "react";

import { Button, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

import CustomDialog from "@/components/dialog/CustomDialog";
import CustomTextField from "@/@core/components/mui/TextField";

const DialogAdd = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)} variant='contained'>
        Show Dialog
      </Button>
      <CustomDialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth={"sm"}>
        <DialogTitle>
          Atur Jadwal
          <Typography variant='body1' color={"GrayText"}>
            Tambahkan hari libur atau perbarui hari kerja.
          </Typography>
        </DialogTitle>
        <DialogContent>
          <CustomTextField select fullWidth label='Tipe Jadwal'></CustomTextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} variant='tonal' color='secondary'>
            Batal
          </Button>
          <Button variant='contained'>Simpan</Button>
        </DialogActions>
      </CustomDialog>
    </div>
  );
};

export default DialogAdd;
