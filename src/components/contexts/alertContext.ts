"use client";
import { AlertColor } from "@mui/material/Alert";
import { createContext } from "react";

type AlertContextType = {
  showAlert: (message: string, severity?: AlertColor) => void;
};
export const AlertContext = createContext<AlertContextType | undefined>(
  undefined
);
