"use client";
import { Fade } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { createPortal } from "react-dom";

export default function AppLineProgress() {
  return createPortal(
    <Fade
      in
      timeout={100}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        zIndex: 1700,
      }}
    >
      <LinearProgress />
    </Fade>,
    document.body
  );
}
