"use client"
import { TDictionaryKeys, TReturnOfGetDictionary } from "@/app/[lang]/dictionaries"
import { LangCtx } from "../contexts/langParamCtx"

export type TProps = {
  children: React.ReactNode
  dict: TReturnOfGetDictionary
  lang: TDictionaryKeys
}

export default function LangProvider({ children, dict, lang }: TProps) {
  return <LangCtx value={{lang, dict}}>{children}</LangCtx>
}
