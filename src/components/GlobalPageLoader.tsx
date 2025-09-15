"use client";

import { Backdrop, CircularProgress, Typography, Box } from "@mui/material";

import { usePageLoading } from "@/@core/contexts/loadingContext";

const GlobalPageLoader = () => {
  const { isPageLoading } = usePageLoading();

  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)"
      }}
      open={isPageLoading}
    >
      <Box display='flex' flexDirection='column' alignItems='center' gap={2}>
        <CircularProgress color='primary' size={60} />
        <Typography variant='h6' color='inherit'>
          Memuat halaman...
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default GlobalPageLoader;
