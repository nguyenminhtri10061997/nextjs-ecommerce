import { DictTypeGenerated } from "@/types/dictTypeGenerated"
import { createContext } from "react"

type TDashboardCtx = {
  dict: DictTypeGenerated
} | null

export const DashboardCtx = createContext<TDashboardCtx>(null)
