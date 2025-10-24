import { createContext, Dispatch, SetStateAction } from "react";

type TDashboardLineProgressCtx = {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
} | null;

export const DashBoardLineProgressCtx =
  createContext<TDashboardLineProgressCtx>(null);
