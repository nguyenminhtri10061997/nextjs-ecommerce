'use client'

import { TDictionaryKeys, TReturnOfGetDictionary } from "@/app/[lang]/dictionaries"
import { createContext } from "react"

export const LangCtx = createContext<{ lang: TDictionaryKeys, dict: TReturnOfGetDictionary| null }>({ lang: 'en-US', dict: null })
