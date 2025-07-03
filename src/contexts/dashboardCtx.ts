import { DictTypeGenerated } from "@/types/dictTypeGenerated";
import { createContext, Dispatch, SetStateAction } from "react";

type TDashboardCtx = {
  breadcrumbs: string[];
  setBreadCrumbs: Dispatch<SetStateAction<string[]>>;
  dict: DictTypeGenerated
} | null;

export const DashboardCtx = createContext<TDashboardCtx>(null);
