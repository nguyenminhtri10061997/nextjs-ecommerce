"use client";
import AlertProvider from "@/components/providers/AlertProvider";
import DashboardProvider from "@/components/providers/dashBoardProvider";
import LoadingProvider from "@/components/providers/loadingProvider";
import { DictTypeGenerated } from "@/types/dictTypeGenerated";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material";
import { queryClient } from "@/constants/queryClient";
import theme from "@/constants/theme/clientTheme";

export default function ClientDashboardLayoutLayout({
  children,
  dict,
}: {
  children: React.ReactNode;
  dict: DictTypeGenerated;
}) {
  return (
    <ThemeProvider theme={theme} defaultMode="light">
      <LoadingProvider>
        <AlertProvider>
          <QueryClientProvider client={queryClient}>
            <DashboardProvider dict={dict}>{children}</DashboardProvider>
          </QueryClientProvider>
        </AlertProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}
