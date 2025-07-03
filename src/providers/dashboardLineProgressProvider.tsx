import { DashBoardLineProgressCtx } from "@/contexts/dashboardLineProgressCtx";
import LinearProgress from "@mui/material/LinearProgress";
import { useState } from "react";

export default function DashboardLineProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <DashBoardLineProgressCtx
      value={{
        loading,
        setLoading,
      }}
    >
      {children}
      <LinearProgress />
    </DashBoardLineProgressCtx>
  );
}
