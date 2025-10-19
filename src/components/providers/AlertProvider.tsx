"use client";
import { AlertContext } from "@/components/contexts/alertContext";
import Alert, {
  AlertColor,
  AlertPropsColorOverrides,
} from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { OverridableStringUnion } from "@mui/types";
import { useState } from "react";

export default function AlertProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] =
    useState<OverridableStringUnion<AlertColor, AlertPropsColorOverrides>>(
      "info"
    );

  const handleClose = () => {
    setOpen(false);
  };

  const showAlert = (
    mess: string = "",
    severity: OverridableStringUnion<
      AlertColor,
      AlertPropsColorOverrides
    > = "success"
  ) => {
    setMessage(mess);
    setOpen(true);
    setSeverity(severity);
  };

  return (
    <AlertContext value={{ showAlert }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </AlertContext>
  );
}
