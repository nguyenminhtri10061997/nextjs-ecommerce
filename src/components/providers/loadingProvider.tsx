'use client'
import { LoadingCtx } from "@/components/contexts/loadingCtx";
import { Backdrop, CircularProgress } from "@mui/material";
import Fade from "@mui/material/Fade";
import { useDeferredValue, useState } from "react";

export default function LoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const loadingDeferred = useDeferredValue(loading);

  return (
    <LoadingCtx
      value={{
        loading,
        setLoading,
      }}
    >
      {children}
      <Fade in={loadingDeferred} timeout={100}>
        <Backdrop open sx={{ zIndex: 1600 }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Fade>
    </LoadingCtx>
  );
}
