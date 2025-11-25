import { TReturnOfGetDictionary } from "@/app/[lang]/dictionaries"
import { createContext } from "react"

type TDashboardCtx = {
  dict: TReturnOfGetDictionary
} | null

export const DashboardCtx = createContext<TDashboardCtx>(null)
