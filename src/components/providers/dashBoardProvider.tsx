'use client'
import { TReturnOfGetDictionary } from "@/app/[lang]/dictionaries";
import { DashboardCtx } from "@/components/contexts/dashboardCtx";

export default function DashboardProvider({
  children,
  dict,
}: {
  children: React.ReactNode;
  dict: TReturnOfGetDictionary;
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