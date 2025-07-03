import { LoadingCtx } from "@/contexts/loadingCtx";
import { Backdrop, CircularProgress } from "@mui/material";
import { useState } from "react";

export default function LoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <LoadingCtx
      value={{
        loading,
        setLoading,
      }}
    >
      {children}
      <Backdrop open={loading} sx={{ zIndex: 1600 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </LoadingCtx>
  );
}
