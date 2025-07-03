'use client'
import { queryClient } from "@/lib/queryClient";
import AlertProvider from "@/providers/AlertProvider";
import DashboardProvider from "@/providers/dashBoardProvider";
import LoadingProvider from "@/providers/loadingProvider";
import { DictTypeGenerated } from "@/types/dictTypeGenerated";
import { QueryClientProvider } from "@tanstack/react-query";

export default function ClientDashboardLayoutLayout({ children, dict }: { children: React.ReactNode, dict: DictTypeGenerated }) {
  return (
    <LoadingProvider>
      <AlertProvider>
        <QueryClientProvider client={queryClient}>
          <DashboardProvider dict={dict}>
            {children}
          </DashboardProvider>
        </QueryClientProvider>
      </AlertProvider>
    </LoadingProvider>
  );
}
