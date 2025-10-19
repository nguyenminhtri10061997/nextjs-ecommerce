import { DashBoardLineProgressCtx } from "@/components/contexts/dashboardLineProgressCtx";
import { useContext } from "react";

export const useDashBoardLineProgressCtx = () => {
  const context = useContext(DashBoardLineProgressCtx);
  if (!context)
    throw new Error(
      "DashBoardLineProgressCtx must be used within DashBoardLineProgressProvider"
    );
  return context;
};
