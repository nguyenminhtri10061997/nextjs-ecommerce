import { useContext } from "react"
import { LangCtx } from "../contexts/langParamCtx"

export const useLang = () => {
  const context = useContext(LangCtx)
  if (!context)
    throw new Error("useLang must be used within LangProvider")
  return context
}
