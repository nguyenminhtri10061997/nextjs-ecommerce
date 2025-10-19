import { DashboardCtx } from "@/components/contexts/dashboardCtx";
import { DictTypeGenerated } from "@/types/dictTypeGenerated";

export default function DashboardProvider({
  children,
  dict,
}: {
  children: React.ReactNode;
  dict: DictTypeGenerated;
}) {
  return (
    <DashboardCtx
      value={{
        dict,
      }}
    >
      {children}
    </DashboardCtx>
  );
}
