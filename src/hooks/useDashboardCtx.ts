import { DashboardCtx } from "@/contexts/dashboardCtx";
import { useContext } from "react";

export const useDashboardCtx = () => {
    const context = useContext(DashboardCtx)
    if (!context) throw new Error('useDashboardCtx must be used within DashboardProvider');
    return context;
}